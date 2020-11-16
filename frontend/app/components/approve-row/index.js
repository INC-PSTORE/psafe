/*
* table Pagination
*/

import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import {compose} from 'redux';
import styles from './styles';
import Button from "@material-ui/core/Button";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WalletRowDetail from '../../components/new-wallet-row-detail';
import {APPROVED, REJECTED} from "../../common/constants";
import ApproveRowDetail from "../../components/approve-row-detail";

/* eslint-disable react/prefer-stateless-function */
export class ApproveRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.updateRequest = this.updateRequest.bind(this);
    this.clickWalletRow = this.clickWalletRow.bind(this);
  }

  handleApprove(e) {
    e.preventDefault();
    e.stopPropagation();
    this.updateRequest(APPROVED);
  };

  handleReject(e) {
    e.preventDefault();
    e.stopPropagation();
    this.updateRequest(REJECTED);
  }

  updateRequest = (type) => {
    const {onUpdateRequest, row} = this.props;
    onUpdateRequest(row, type);
  }

  clickWalletRow = () => {
    const {row, onUpdateSelectedRow} = this.props;
    onUpdateSelectedRow(row);
  }

  render() {
    const { classes, row, selectedRow} = this.props;
    return (
      <>
        <TableRow key={"Approve_" + row.withdrawId} onClick={this.clickWalletRow} className={classes.row}>
          <TableCell className={classes.cell}>
            <div className={classes.walletAddrCell}>
              <ExpandMoreIcon />
              <Typography className={classes.walletAddr}>Requester - {row.ethAddressStr}</Typography>
            </div>
            <div className={classes.actionButtons}>
              <Button onClick={this.handleApprove} color="primary" className={classes.inlineButton} >
                Approve
              </Button>
              <Button onClick={this.handleReject} color="secondary" className={classes.inlineButton} >
                Reject
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {selectedRow && selectedRow.withdrawId === row.withdrawId &&
          <TableRow className={classes.walletDetailRow}>
            <ApproveRowDetail
              row={row}
            />
          </TableRow>
        }
      </>
    );
  }
}

const withMyStyles = withStyles(styles);

export default compose(withMyStyles)(ApproveRow);
