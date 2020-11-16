/*
* table Pagination
*/

import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import {compose} from 'redux';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import {
  getDefaultSupportedTokens,
} from '../../common/utils';
import WalletRow from "../new-wallet-row";

/* eslint-disable react/prefer-stateless-function */
export class WalletWithdraw extends React.PureComponent {
  constructor(props) {
    super(props);
    this.buildSupportedTokenMenuItems = this.buildSupportedTokenMenuItems.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeSelectedPToken = this.changeSelectedPToken.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.nexStep = this.nexStep.bind(this);
  }

  handleClose = () => {
    const {updateModal} = this.props;
    updateModal(3, false);
  };

  changeSelectedPToken(event) {
    const {updateWithdrawForm, formWithdraw} = this.props;
    formWithdraw.tokenId = event.target.value;
    updateWithdrawForm(formWithdraw);
  }

  changeAmount(event) {
    const {updateWithdrawForm, formWithdraw} = this.props;
    formWithdraw.amount = Number(event.target.value);
    updateWithdrawForm(formWithdraw);
  }

  nexStep() {
    const {ethAccount, WithdrawStep2Thunk, formWithdraw, walletSelected} = this.props;
    WithdrawStep2Thunk(ethAccount, walletSelected, formWithdraw);
  }

  buildSupportedTokenMenuItems() {
    let supportedCoins = getDefaultSupportedTokens();
    supportedCoins.shift()
    return supportedCoins.map(item =>
      <MenuItem key={item.extTokenId} value={item.extTokenId}>
        {item.tokenName}
      </MenuItem>
    );
  }

  render() {
    const {classes, walletSelected, formWithdraw} = this.props;
    return (
      <div className={classes.root} tabIndex={-1}>
        <div className={classes.wrapper}>
          <>
            <h3 className={classes.title}>
              Wallet Id {walletSelected.walletId}
            </h3>
            <FormControl className={classes.form}>
              <InputLabel htmlFor="token-select">pCoin</InputLabel>
              <Select
                input={<Input id="token-select"/>}
                value={formWithdraw.tokenId}
                onChange={this.changeSelectedPToken}
              >
                {this.buildSupportedTokenMenuItems()}
              </Select>
            </FormControl>

            <FormControl className={classes.form}>
              <InputLabel htmlFor="amount-input">Amount</InputLabel>
              <Input
                value={formWithdraw.amount}
                type="number"
                id="amount-input"
                aria-describedby="amount-helper-text"
                onChange={this.changeAmount}
              />

            </FormControl>
            <div className={classes.withdrawButtonGroup}>
              <Button className={classes.withdrawButton} onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button className={classes.withdrawButton} onClick={this.nexStep} variant="contained" color="primary">
                Request
              </Button>
            </div>
          </>
        </div>
      </div>
    );
  }
}

const withMyStyles = withStyles(styles);

export default compose(withMyStyles)(WalletWithdraw);
