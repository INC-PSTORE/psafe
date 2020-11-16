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
import {
  getDefaultSupportedTokens,
} from '../../common/utils';

/* eslint-disable react/prefer-stateless-function */
export class WalletFund extends React.PureComponent {
  constructor(props) {
    super(props);
    this.buildSupportedTokenMenuItems = this.buildSupportedTokenMenuItems.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeSelectedPToken = this.changeSelectedPToken.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleClose = () => {
    const {updateModal} = this.props;
    updateModal(2, false);
  };

  changeSelectedPToken(event) {
    const {updateFundForm, formFund} = this.props;
    formFund.tokenId = event.target.value;
    updateFundForm(formFund);
  }

  changeAmount(event) {
    const {updateFundForm, formFund} = this.props;
    formFund.amount = Number(event.target.value);
    updateFundForm(formFund);
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

  submit() {
    const{walletSelected, formFund, ethAccount, submitFund} = this.props;
    submitFund(walletSelected, formFund, ethAccount);
  }

  render() {
    const {classes, walletSelected, formFund} = this.props;
    return (
      <div className={classes.root} tabIndex={-1}>
        <div className={classes.wrapper} >
          <h3>Wallet Id {walletSelected.walletId}</h3>
          <FormControl className={classes.form}>
            <InputLabel htmlFor="token-select">pCoin</InputLabel>
            <Select
              input={<Input id="token-select"/>}
              value={formFund.tokenId}
              onChange={this.changeSelectedPToken}
            >
              {this.buildSupportedTokenMenuItems()}
            </Select>
          </FormControl>

          <FormControl className={classes.form}>
            <InputLabel htmlFor="amount-input">Amount</InputLabel>
            <Input
              autoComplete={"off"}
              value={formFund.amount}
              type="number"
              id="amount-input"
              aria-describedby="amount-helper-text"
              onChange={this.changeAmount}
            />
          </FormControl>
          <div className={classes.actionsButtons}>
            <Button className={classes.actionsButton} onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button className={classes.actionsButton} onClick={this.submit} variant="contained" color="primary">
              Fund
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const withMyStyles = withStyles(styles);

export default compose(withMyStyles)(WalletFund);
