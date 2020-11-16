/*
* table Pagination
*/

import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import {compose} from 'redux';
import styles from './styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WalletRowDetail from '../../components/new-wallet-row-detail';

/* eslint-disable react/prefer-stateless-function */
export class WalletRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleFundOpen = this.handleFundOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleWithdrawOpen = this.handleWithdrawOpen.bind(this);
    this.updateWallet = this.updateWallet.bind(this);
    this.clickWalletRow = this.clickWalletRow.bind(this);
    this.refresh = this.refresh.bind(this);
    this.renew = this.renew.bind(this);
    this.submit = this.submit.bind(this);
    this.pending = this.pending.bind(this);
  }

  handleFundOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    const {updateModal, row} = this.props;
    updateModal(2, true);
    this.updateWallet(row);
  };

  handleWithdrawOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    const {updateModal, row} = this.props;
    updateModal(3, true);
    this.updateWallet(row);
  }

  updateWallet = (wallet) => {
    const {updateWalletSelected} = this.props;
    updateWalletSelected(wallet);
  }

  handleClose = () => {
    const {updateModal} = this.props;
    updateModal(2, false);
    updateModal(3, false);
  };

  clickWalletRow() {
    const {row, onClickWalletRow} = this.props;
    onClickWalletRow(row);
  }

  renew(e) {
    e.preventDefault();
    e.stopPropagation();
    const {onRecreateWithdraw, row} = this.props;
    onRecreateWithdraw(row);
  }

  submit(e) {
    e.preventDefault();
    e.stopPropagation();
    const {ethAccount, submitWithdraw, row} = this.props;
    submitWithdraw(row, row.withdrawRequest, ethAccount);
  }

  refresh(e) {
    e.preventDefault();
    e.stopPropagation();
    const {onGetWithdrawRequestByAddressAndWalletId, row} = this.props;
    onGetWithdrawRequestByAddressAndWalletId(row);
  }

  pending(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {classes, row, getSelectedRowDetail} = this.props;
    return (
      <>
        <TableRow key={"Wallet_" + row.walletId} onClick={this.clickWalletRow} className={classes.row}>
          <TableCell className={classes.cell}>
            <div className={classes.walletAddrCell}>
              <ExpandMoreIcon />
              <Typography className={classes.walletAddr}>Wallet ID - {row.walletId}</Typography>
            </div>
            <div className={classes.actionButtons}>
              <IconButton style={{ display: row.withdrawRequest && row.withdrawRequest.statusFromOwners === 0 ? 'inline' : 'none' }} onClick={this.refresh} aria-label="logo">
                <Icon fontSize="small">refresh</Icon>
              </IconButton>
              <Button onClick={this.handleFundOpen} color="primary" className={classes.inlineButton} >
                Fund
              </Button>
              {row && row.withdrawRequest
                ?
                row.withdrawRequest.statusFromOwners === 1
                  ?
                  <Button onClick={this.submit} color="secondary" className={classes.inlineButton}>
                    Submit
                  </Button>
                  :
                  row.withdrawRequest.statusFromOwners === 2
                    ?
                    <Button onClick={this.renew} color="secondary" className={classes.inlineButton}>
                      Renew
                    </Button>
                    :
                    <Button onClick={this.pending} color="secondary" className={classes.inlineButton}>
                      Pending
                    </Button>
                :
                <Button onClick={this.handleWithdrawOpen} color="secondary" className={classes.inlineButton}>
                  Withdraw
                </Button>
              }
            </div>
          </TableCell>
        </TableRow>
        {getSelectedRowDetail && getSelectedRowDetail.walletId === row.walletId &&
        <TableRow className={classes.walletDetailRow}>
          <WalletRowDetail
            getSelectedRowDetail={getSelectedRowDetail}
            row={row}
          />
        </TableRow>
        }
      </>
    );
  }
}

const withMyStyles = withStyles(styles);

export default compose(withMyStyles)(WalletRow);
