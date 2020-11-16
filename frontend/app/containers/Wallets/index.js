/*
* Wallets Page
*/

import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';
import reducer from './reducer';
import injectReducer from 'utils/injectReducer';
import styles from './styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TablePaginationActions from '../../components/table-pagination';
import NewWalletModal from '../../components/new-wallet';
import WalletRow from '../../components/new-wallet-row'
import WalletFund from '../../components/wallet-fund';
import WalletWithdraw from '../../components/wallet-withdraw';

import {
  makeSelectETHAccount,
} from '../App/selectors';
import {
  onChangeModal,
  onChangePage,
  onChangeRowsPerPage,
  onChangeNewWalletForm,
  onChangeListening,
  onChangeWalletSelected,
  onChangeFundForm,
  onChangeWithdrawForm,
  updateValidateForm,
  onChangeWithdrawFormStep2,
  onChangeWithdrawStep,
  onChangeDetailWallet,
} from './actions';
import {
  makeSelectRowPerPage,
  makeSelectValidateForm,
  makeSelectRows,
  makeSelectPage,
  makeSelectNewWalletModal,
  makeSelectNewWalletModalForm,
  makeSelectWalletIsListening,
  makeSelectFundModal,
  makeSelectWithdrawModal,
  makeSelectWalletSelected,
  makeSelectFormFund,
  makeSelectFormWithdraw,
  makeSelectFormWithdrawStep2,
  makeSelectWithdrawStep,
  makeSelectRowDetailSelected,
} from './selectors'

import {
  listenEvent,
  createNewWalletThunk,
  fundThunk,
  withdrawThunk,
  WithdrawStep2Thunk,
  getWalletBalancesThunk,
  getWithdrawRequestByAddressAndWalletId, renewThunk,
} from './middlewares'

import Snackbar from "@material-ui/core/Snackbar";
import {loadAccountsThunk} from "../App/middlewares";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

/* eslint-disable react/prefer-stateless-function */
export class WalletPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.clickWalletRow = this.clickWalletRow.bind(this);
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

  handleClose = () => {
    const {updateModal} = this.props;
    updateModal(2, false);
    updateModal(3, false);
  };

  handleChangePage = (event, page) => {
    const {updatePage} = this.props;
    updatePage(page);
  };

  handleChangeRowsPerPage = event => {
    const {updateRowsPerPage} = this.props;
    updateRowsPerPage(0, Number(event.target.value));
  };

  componentDidMount() {
    const {isListening, updateWalletEventListen, activeListenEvent} = this.props;
    if (isListening) return;
    activeListenEvent();
    updateWalletEventListen(true);
  }

  clickWalletRow(row) {
    const { onChangeDetailWallet, getSelectedRowDetail, onGetWalletBalancesThunk } = this.props;
    if (getSelectedRowDetail && getSelectedRowDetail.walletId === row.walletId) {
      onChangeDetailWallet(null);
    } else {
      onGetWalletBalancesThunk(row.walletId);
    }
  }

  render() {
    const {
      classes,
      formValidate,
      rows,
      rowsPerPage,
      page,
      isNewWalletOpen,
      updateModal,
      updateNewWalletModalForm,
      newWalletModalForm,
      ethAccount,
      creatNewWallet,
      isWithdrawOpen,
      isFundOpen,
      updateWalletSelected,
      walletSelected,
      updateWithdrawForm,
      updateFundForm,
      formWithdraw,
      formFund,
      submitFund,
      submitWithdraw,
      updateWithdrawFormStep2,
      updateWithdrawStep,
      formWithdrawStep2,
      withdrawStep,
      WithdrawStep2Thunk,
      onChangeDetailWallet,
      getSelectedRowDetail,
      onGetWalletBalancesThunk,
      onGetWithdrawRequestByAddressAndWalletId,
      onRecreateWithdraw,
    } = this.props;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    let snackBarDisplay = classes.snackBarContent;
    if (formValidate && formValidate.snackBar && formValidate.snackBar.isSuccess) {
      snackBarDisplay = classes.snackBarContentSuccess;
    }

    return (
      <div className={classes.root}>
        {formValidate && formValidate.snackBar && (formValidate.snackBar.isError || formValidate.snackBar.isSuccess) &&
        <Snackbar
          className={classes.snackBar}
          ContentProps={{
            className: snackBarDisplay,
          }}
          open={(formValidate.snackBar.isError || formValidate.snackBar.isSuccess)}
          autoHideDuration={3000}
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
        {/*incognito banner*/}
        <div className={classes.incognitoTreasure}>
          <div className={classes.incognitoTreasureText}>
            <h3>The treasure hunting has begun.</h3>
            <Button target={"blank"} href={"https://incognito.org/quest"} variant="contained"
                    style={{backgroundColor: 'black', color: 'white'}} >
              Check it out
            </Button>
          </div>
          <img className={classes.incognitoTreasureImg}
               src={"https://incognito-discourse.s3-us-west-2.amazonaws.com/optimized/2X/b/bcb6b414fac7767f90a06d26c54d01f4e123a9fa_2_512x306.jpeg"}/>
        </div>



        {/*Create new wallet*/}

        <NewWalletModal
          isNewWalletOpen={isNewWalletOpen}
          updateModal={updateModal}
          updateNewWalletModalForm={updateNewWalletModalForm}
          newWalletModalForm={newWalletModalForm}
          ethAccount={ethAccount}
          creatNewWallet={creatNewWallet}
          className={classes.newWallet}
        />

        {/* Display Table */}
        <Paper className={classes.paper}>
          <div className={classes.tableWrapper}>
            {rows && rows.length === 0
              ?
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h5>No Records!</h5>
              </div>
              :
              <Table className={classes.tableInsideStyle}>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                    <WalletRow
                      key={"Wallet_" + row.walletId}
                      row={row}
                      updateModal={updateModal}
                      updateWalletSelected={updateWalletSelected}
                      getSelectedRowDetail={getSelectedRowDetail}
                      onClickWalletRow={this.clickWalletRow}
                      onGetWithdrawRequestByAddressAndWalletId={onGetWithdrawRequestByAddressAndWalletId}
                      onRecreateWithdraw={onRecreateWithdraw}
                      walletSelected={walletSelected}
                      submitWithdraw={submitWithdraw}
                      ethAccount={ethAccount}
                    />
                  ))}
                  {/* {emptyRows > 0 && (
                    <TableRow style={{height: 48 * emptyRows}}>
                      <TableCell colSpan={6}/>
                    </TableRow>
                  )} */}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        native: true,
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter> */}
              </Table>
            }
          </div>
        </Paper>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isFundOpen || isWithdrawOpen}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isFundOpen || isWithdrawOpen}>
            {
              isFundOpen
              ?
              <WalletFund
                walletSelected={walletSelected}
                updateFundForm={updateFundForm}
                formFund={formFund}
                submitFund={submitFund}
                updateModal={updateModal}
                ethAccount={ethAccount}
              />
              :
              isWithdrawOpen
              ?
              <WalletWithdraw
                walletSelected={walletSelected}
                updateWithdrawForm={updateWithdrawForm}
                formWithdraw={formWithdraw}
                updateModal={updateModal}
                ethAccount={ethAccount}
                updateWithdrawFormStep2={updateWithdrawFormStep2}
                updateWithdrawStep={updateWithdrawStep}
                withdrawStep={withdrawStep}
                WithdrawStep2Thunk={WithdrawStep2Thunk}
                onRecreateWithdraw={onRecreateWithdraw}
              />
              :
              <div/>
            }
          </Fade>
        </Modal>
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    updatePage: (page) => dispatch(onChangePage(page)),
    updateRowsPerPage: (page, rowsPerPage) => dispatch(onChangeRowsPerPage(page, rowsPerPage)),
    updateModal: (modal, value) => dispatch(onChangeModal(modal, value)),
    updateNewWalletModalForm: (walletModalForm) => dispatch(onChangeNewWalletForm(walletModalForm)),
    updateWalletEventListen: (value) => dispatch(onChangeListening(value)),
    activeListenEvent: () => dispatch(listenEvent()),
    creatNewWallet: (ethAccount, newWalletInfo) => dispatch(createNewWalletThunk(ethAccount, newWalletInfo)),
    updateWalletSelected: (wallet) => dispatch(onChangeWalletSelected(wallet)),
    updateFundForm: (formInfo) => dispatch(onChangeFundForm(formInfo)),
    updateWithdrawForm: (formInfo) => dispatch(onChangeWithdrawForm(formInfo)),
    onUpdateValidateForm: (validateForm) => dispatch(updateValidateForm(validateForm)),
    submitFund: (walletSelected, formFund, ethAccount) => dispatch(fundThunk(walletSelected, formFund, ethAccount)),
    submitWithdraw: (walletSelected, formWithdrawStep2, ethAccount) => dispatch(withdrawThunk(walletSelected, formWithdrawStep2, ethAccount)),
    updateWithdrawFormStep2: (formStep2) => dispatch(onChangeWithdrawFormStep2(formStep2)),
    updateWithdrawStep: (step) => dispatch(onChangeWithdrawStep(step)),
    WithdrawStep2Thunk: (ethAccount, walletSelected, formWithdraw) => dispatch(WithdrawStep2Thunk(ethAccount, walletSelected, formWithdraw)),
    onChangeDetailWallet: (detailObject) => dispatch(onChangeDetailWallet(detailObject)),
    onGetWalletBalancesThunk: (walletId) => dispatch(getWalletBalancesThunk(walletId)),
    onGetWithdrawRequestByAddressAndWalletId: (row) => dispatch(getWithdrawRequestByAddressAndWalletId(row)),
    onRecreateWithdraw: (formWithdrawStep2) => dispatch(renewThunk(formWithdrawStep2)),
  }
}

const mapStateToProps = createStructuredSelector({
  ethAccount: makeSelectETHAccount(),
  formValidate: makeSelectValidateForm(),
  rows: makeSelectRows(),
  rowsPerPage: makeSelectRowPerPage(),
  page: makeSelectPage(),
  isNewWalletOpen: makeSelectNewWalletModal(),
  isFundOpen: makeSelectFundModal(),
  isWithdrawOpen: makeSelectWithdrawModal(),
  newWalletModalForm: makeSelectNewWalletModalForm(),
  isListening: makeSelectWalletIsListening(),
  walletSelected: makeSelectWalletSelected(),
  formFund: makeSelectFormFund(),
  formWithdraw: makeSelectFormWithdraw(),
  formWithdrawStep2: makeSelectFormWithdrawStep2(),
  withdrawStep: makeSelectWithdrawStep(),
  getSelectedRowDetail: makeSelectRowDetailSelected(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({key: 'wallet', reducer});

const withStylesWalletPage = withStyles(styles);
const withWidthWalletPage = withWidth();

export default compose(
  withReducer,
  withConnect,
  withStylesWalletPage,
  withWidthWalletPage,
)(WalletPage);
