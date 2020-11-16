/*
* Sign Page
*/

import React from 'react';
import {
  updateValidateForm,
  updateDataToSign,
  updateSelectedRow,
} from "./actions";
import {createStructuredSelector} from "reselect";
import {makeSelectETHAccount} from "../App/selectors";
import {
  makeSelectValidateForm,
  makeSelectDataToSign,
  makeSelectSignature,
  makeSelectSelectedRow,
  makeSelectRows,
} from "./selectors";
import {connect} from "react-redux";
import reducer from './reducer';

import {withStyles} from "@material-ui/core/styles";
import styles from "./styles";
import withWidth from "@material-ui/core/withWidth";
import {compose} from "redux";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import injectReducer from 'utils/injectReducer';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import WalletRow from "../../components/new-wallet-row";
import Paper from "@material-ui/core/Paper";
import ApproveRow from "../../components/approve-row";
import {approveActionThunk, getRequestsThunk} from "./middlewares";

/* eslint-disable react/prefer-stateless-function */
export class SignPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.clickApproveRow = this.clickApproveRow.bind(this);
  }

  handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    const {formValidate, onUpdateValidateForm} = this.props;
    if (formValidate.snackBar) {
      onUpdateValidateForm(null);
    }
  }

  clickApproveRow(row) {
    const { onUpdateSelectedRow, selectedRow } = this.props;
    if (selectedRow && selectedRow.withdrawId === row.withdrawId) {
      onUpdateSelectedRow(null);
    } else {
      onUpdateSelectedRow(row);
    }
  }

  componentDidMount() {
    const {onUpdateRows} = this.props;
    onUpdateRows();
  }

  render() {
    const {classes, rows, formValidate, selectedRow, onUpdateRequest} = this.props;
    let snackBarDisplay = classes.snackBarContent;
    if (formValidate && formValidate.snackBar && formValidate.snackBar.isSuccess) {
      snackBarDisplay = classes.snackBarContentSuccess;
    }
    return (
      <div className={classes.root}>
        {formValidate && formValidate.snackBar && (formValidate.snackBar.isError || formValidate.snackBar.isSuccess)&&
        <Snackbar
          className={classes.snackBar}
          ContentProps={{
            className: snackBarDisplay,
          }}
          open={formValidate.snackBar.isError || formValidate.snackBar.isSuccess}
          autoHideDuration={2000}
          message={formValidate.snackBar.message}
          onClose={this.handleSnackbarClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          action={
            <>
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbarClose}>
                <CloseIcon fontSize="small"/>
              </IconButton>
            </>
          }
        />
        }
        <Paper className={classes.paper}>
          <div className={classes.tableWrapper}>
            {!rows || rows.length === 0
              ?
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h4>No Records!</h4>
              </div>
              :
              <Table className={classes.tableInsideStyle}>
                <TableBody>
                  {rows.map(row => (
                    <ApproveRow
                      key={"Approve_" + row.withdrawId}
                      row={row}
                      onUpdateSelectedRow={this.clickApproveRow}
                      selectedRow={selectedRow}
                      onUpdateRequest={onUpdateRequest}
                    />
                  ))}
                </TableBody>
              </Table>
            }
          </div>
        </Paper>
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateValidateForm: (validateForm) => dispatch(updateValidateForm(validateForm)),
    onUpdateDataToSign: (dateToSign, ethAccount) => dispatch(updateDataToSign(dateToSign, ethAccount)),
    onUpdateSelectedRow: (selectedRow) => dispatch(updateSelectedRow(selectedRow)),
    onUpdateRequest: (selectedRow, type) => dispatch(approveActionThunk(selectedRow, type)),
    onUpdateRows: () => dispatch(getRequestsThunk()),
  }
}

const mapStateToProps = createStructuredSelector({
  ethAccount: makeSelectETHAccount(),
  formValidate: makeSelectValidateForm(),
  signature: makeSelectSignature(),
  dataToSign: makeSelectDataToSign(),
  selectedRow: makeSelectSelectedRow(),
  rows: makeSelectRows(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sign', reducer });

const withStylesWalletPage = withStyles(styles);
const withWidthWalletPage = withWidth();

export default compose(
  withReducer,
  withConnect,
  withStylesWalletPage,
  withWidthWalletPage,
)(SignPage);