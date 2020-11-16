import React from 'react';
import { getBalanceByToken, getIncKeyFromAccount } from '../../../services/incognito/wallet';
import { getBalance as getETHBalance, getKeysFromAccount } from '../../../services/eth/wallet';
import { onError } from '../../../services/errorHandler';
import { incFormatBalance, ethFormatBalance } from '../../../utils/format';
import { Typography, withStyles, Button } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/EjectOutlined';
import styles from './styles';
import { ACCOUNT_TYPE } from '../../../containers/accounts/constants';
import { TOKEN_INFO } from '../../../common/constants';

class TokenItem extends React.Component {
    constructor() {
        super();

        this.state = { 
            balance: null,
            isLoading: false,
            incTokenInstance: null,
            accountKeys: null,
            isShowTransfer: false,
            isIncToken: false
        };
    }

    componentDidUpdate(prevProps) {
        const { account, token, accountType } = this.props;
        const { tokenId } = token || {};

        if (prevProps && prevProps.token && prevProps.token.tokenId !== tokenId || account !== prevProps.account) {
            this.getTokenInfo(account, token, accountType);
        }
    }
  
    componentDidMount() {
        const { token, account, accountType } = this.props;
        this.getTokenInfo(account, token, accountType);
    }

    isPRVToken() {
        
        const { token } = this.props;
        return token && token.tokenId === TOKEN_INFO.PRV.tokenId;
    }

    isETHToken() {
        const { token } = this.props;
        return token && token.tokenId === '0x0000000000000000000000000000000000000000';
    }

    async getTokenInfo(account, token, type) {
        if (type === ACCOUNT_TYPE.ETH) {
            this.setState({ isIncToken: false });
            return await this.getETHToken(account, token);
        } else if (type === ACCOUNT_TYPE.INC) {
            this.setState({ isIncToken: true });
            return await this.getIncToken(account, token);
        }
    }

    async getIncToken(account, token) {
        const { tokenId } = token;

        if (tokenId) {
            let incTokenInstance;
            if (this.isPRVToken()) {
                incTokenInstance = account.nativeToken;
            } else {
                incTokenInstance = await account.getFollowingPrivacyToken(tokenId);
            }
    
            this.setState({ incTokenInstance }, () => {
                this.loadIncBalance(incTokenInstance);
            });
        }
    }

    async loadIncBalance(incTokenInstance) {
        try {
            this.setState({ isLoading: true });
            const balance = await getBalanceByToken(incTokenInstance);
            this.setState({ balance });
        } catch(e) {
            onError(e);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    async getETHToken(account, token) {
        this.setState({ incTokenInstance: token }, () => {
            this.loadETHBalance(account, token);
        })
    }

    async loadETHBalance(account, token) {
        try {
            const { tokenId } = token;
            this.setState({ isLoading: true });

            const address = account.getAddressString()
            const balance = await getETHBalance(address, tokenId);

            this.setState({ balance });
        } catch(e) {
            onError(e);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { classes, onClick, token } = this.props;
        const { balance, incTokenInstance, isIncToken } = this.state;
        const formatedBalance = isIncToken ? incFormatBalance(balance, token.pDecimals) : ethFormatBalance(balance);
        const name = isIncToken ? incTokenInstance && incTokenInstance.name : token && token.tokenName;
        const symbol = isIncToken
            ? incTokenInstance && (incTokenInstance.bridgeInfo && incTokenInstance.bridgeInfo.pSymbol || incTokenInstance.symbol)
            : token && token.tokenName;

        return (
            <div className={classes.container} onClick={() => onClick(incTokenInstance)}>
                <div className={classes.icon}>
                    <EcoIcon />
                </div>
                <div className={classes.nameView}>
                    <Typography noWrap className={classes.name}>{name || '---'}</Typography>
                </div>
                <Typography noWrap className={classes.balance}>{formatedBalance} {symbol || '---'}</Typography>
            </div>
        );
    }
}

export default withStyles(styles)(TokenItem);