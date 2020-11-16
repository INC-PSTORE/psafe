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
import {getDefaultSupportedTokens} from "../../common/utils";

/* eslint-disable react/prefer-stateless-function */
export class WalletRowDetail extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {classes, row, getSelectedRowDetail} = this.props;
    let supportedCoins = getDefaultSupportedTokens();
    supportedCoins.shift();
    return (
      <>
        <TableCell colSpan={10} align="left">
          <div className={classes.section}>
            <Typography>Owners</Typography>
            {row &&
              row.owners.map(owner => (
                <div className={classes.ownerAddrInfo} key={owner}>
                  <PersonIcon />
                  <Typography className={classes.ownerAddress}>
                    {owner}
                  </Typography>
                </div>
              ))
            }
          </div>


          <div className={classes.section}>
            <Typography>Balances</Typography>
            {
              supportedCoins.map(coin => {
                  if (getSelectedRowDetail) {
                    return (
                      <div className={classes.coinInfo} key={coin.tokenName}>
                        <img src={coin.icon} className={classes.icon} />
                        <Typography className={classes.coinName}>
                          {coin.tokenName} : {getSelectedRowDetail[coin.tokenName] ? getSelectedRowDetail[coin.tokenName] / (10 ** coin.eDecimals) : 0}
                        </Typography>
                      </div>
                    )
                  }
                }
              )
            }
          </div>
        </TableCell>
      </>
    );
  }
}

const withMyStyles = withStyles(styles);

export default compose(withMyStyles)(WalletRowDetail);
