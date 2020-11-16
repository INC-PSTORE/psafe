/*
* table Pagination
*/


import PersonIcon from '@material-ui/icons/Person';
import Typography from "@material-ui/core/Typography";
import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import {compose} from 'redux';
import styles from './styles';
import Button from "@material-ui/core/Button";
import TableCell from '@material-ui/core/TableCell';
import {getDefaultSupportedTokens, getTokenById} from "../../common/utils";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

/* eslint-disable react/prefer-stateless-function */
export class ApproveRowDetail extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {classes, row} = this.props;
    let coin = getTokenById(row.tokenId);
    return (
      <>
        <TableCell colSpan={10} align="left">
          <div className={classes.section}>
            <div className={classes.ownerAddrInfo} key={row.withdrawId}>
              <AccountBalanceWalletIcon/>
              <Typography className={classes.ownerAddress}>
                <Typography>Wallet Id - {row.walletId}</Typography>
              </Typography>
            </div>
          </div>

          <div className={classes.section}>
            {!coin
              ?
              <>
                <div className={classes.ownerAddrInfo}>
                  <Typography>Amount: {row.amount}</Typography>
                </div>
                <div className={classes.ownerAddrInfo}>
                  <Typography>Token: {row.tokenId}</Typography>
                </div>
              </>
              :
              <div className={classes.ownerAddrInfo}>
                <img src={coin.icon} alt={"coin icon"} className={classes.icon}/>
                <Typography className={classes.coinName}>{coin.tokenName} : {row.amount / 10 ** coin.eDecimals}</Typography>
              </div>
            }
          </div>
        </TableCell>
      </>
    );
  }
}

const withMyStyles = withStyles(styles);

export default compose(withMyStyles)(ApproveRowDetail);
