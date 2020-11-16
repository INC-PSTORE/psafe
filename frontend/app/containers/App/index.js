/*
* App
*/

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import KeyIcon from '@material-ui/icons/VpnKey';
// import AdminPanelSettingIcon from '@material-ui/icons/AdminPanelSetting';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import withWidth from '@material-ui/core/withWidth';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import HistoryPage from 'containers/HistoryPage/Loadable';
import WalletPage from 'containers/Wallets/Loadable';
import SignPage from 'containers/SignPage/Loadable';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import GlobalStyle from '../../global-styles';
import styles from './styles';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { loadAccountsThunk, enableMetaMask} from './middlewares';

import { InfoDialog } from '../../components/info-dialog';
import { Loader } from '../../components/loader';

import {
  makeSelectETHAccount,
  makeSelectTempIncAccount,
  makeSelectPrivateIncAccount,
  makeSelectIsLoadWalletDone,
  makeSelectIsOpenedInfoDialog,
  makeSelectRequestings,
  makeSelectIsAccountInfoOpened,
  makeSelectDeployedTokens,
  makeSelectGeneratedETHAccFromIncAcc,
  makeSelectMetaMask,
} from './selectors';

import {
  toggleInfoDialog,
  toggleAccountInfo,
  closeAccountInfo,
} from './actions';

import { ETH_PRIVATE_KEY_FIELD_NAME, INC_WALLET_FIELD_NAME, PSTORE_DOMAIN } from './constants';

/* eslint-disable react/prefer-stateless-function */
export class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.buildAppBar = this.buildAppBar.bind(this);
    this.closeInfoDialog = this.closeInfoDialog.bind(this);
    this.closeAccountInfo = this.closeAccountInfo.bind(this);
    this.toggleAccountInfo = this.toggleAccountInfo.bind(this);

    let loadedWalletData = {};
    window.onmessage = function (e) {
      if (e.origin !== PSTORE_DOMAIN) {
        return;
      }
      try {
        const msg = JSON.parse(e.data);
        switch (msg.method) {
          case 'onReady':
            const receiver = document.getElementById('receiver').contentWindow;
            // const ethGetKeyPayload = JSON.stringify({ method: 'get', key: ETH_PRIVATE_KEY_FIELD_NAME });
            const incGetKeyPayload = JSON.stringify({ method: 'get', key: INC_WALLET_FIELD_NAME });
            if (receiver) {
              // receiver.postMessage(ethGetKeyPayload, '*');
              receiver.postMessage(incGetKeyPayload, '*');
            }
            break;

          case 'onReturnData':
            loadedWalletData[msg.key] = msg.value;
            if (Object.keys(loadedWalletData).length === 1) {
              props.onLoadAccounts(loadedWalletData);
            }
            break;

          default:
            break;
        }
      } catch (err) {
        console.log(`WARN: ${err}`);
      }
    };
  }

  componentDidMount() {
    this.props.onEnableMetaMask();
  }

  closeAccountInfo() {
    this.props.onCloseAccountInfo();
  }

  toggleAccountInfo() {
    this.props.onToggleAccountInfo();
  }

  closeInfoDialog() {
    this.props.onToggleInfoDialog();
    window.location = PSTORE_DOMAIN;
  }

  buildAppBar() {
    const {
      classes,
      isAccountInfoOpened,
      deployedTokens,
      generatedETHAccFromIncAcc,
      metaMask,
      onEnableMetaMask,
    } = this.props;

    return (
      <div>
        { metaMask && (!metaMask.isMetaMaskEnabled || metaMask.chainId !== "0x2a") && metaMask.metaMaskRequiredMess &&
        <div className={classes.metaMaskMess}>
          <Typography style={{color: 'white', marginLeft: '10px'}}>{metaMask.metaMaskRequiredMess}</Typography>
          { !metaMask.isMetaMaskEnabled &&
          <Button variant="contained" color="secondary" onClick={onEnableMetaMask}
                  style={{color: 'white', marginLeft: '4px'}}>Connect Now</Button>
          }
        </div>
        }
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton className={classes.homeLogo} aria-label="logo">
              <NavLink className={classes.homeLink} exact to="/">
                <Icon>admin_panel_settings</Icon>
              </NavLink>
            </IconButton>

            <Button color="inherit">
              <NavLink className={classes.link} activeClassName={classes.activeLink} exact to="/wallets">Wallets</NavLink>
            </Button>
            <Button color="inherit">
              <NavLink className={classes.link} activeClassName={classes.activeLink} exact to="/sign">Sign</NavLink>
            </Button>
            {/* <Button color="inherit">
              <NavLink className={classes.link} activeClassName={classes.activeLink} exact to="/history">History</NavLink>
            </Button> */}
          </Toolbar>
          <IconButton
            className={classes.accountLogo}
            aria-label="logo"
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={isAccountInfoOpened ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.toggleAccountInfo}
          >
            <PersonIcon />
          </IconButton>
          <Popper open={isAccountInfoOpened} anchorEl={this.anchorEl} transition disablePortal className={classes.accountInfo}>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.closeAccountInfo}>
                    <MenuList>
                      <div className={classes.accountAddressSection}>
                        <Icon color="primary" className={classes.accountAddrIcon}>admin_panel_settings</Icon>
                        <Typography className={classes.accountAddress}>
                          {generatedETHAccFromIncAcc.address}
                        </Typography>
                      </div>
                      <Divider />
                      {deployedTokens.map(token => (
                        <MenuItem onClick={this.closeAccountInfo} key={token.tokenName} >
                          <div className={classes.coinInfo} >
                            <img src={token.icon} className={classes.icon} />
                            <Typography className={classes.coinName}>
                              {token.tokenName}: {token.deployedBalance}
                            </Typography>
                          </div>
                        </MenuItem>
                      ))}
                      <Divider />
                      <div className={classes.pstoreButtonWrapper}>
                        <Button color="primary" className={classes.pstoreButton} href={PSTORE_DOMAIN} >
                          GO pStore.App
                        </Button>
                      </div>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </AppBar>
      </div>
    );
  }

  render() {
    const {
      isLoadWalletDone,
      isOpenedInfoDialog,
      requestings,
    } = this.props;

    if (!isLoadWalletDone) {
      return (
        <div>
          <Loader isActive={true} />
          <iframe id="receiver" src={`${PSTORE_DOMAIN}/shared-ls`} width="0" height="0">
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      );
    }

    if (isOpenedInfoDialog) {
      return (
        <div>
          <InfoDialog
            isOpenedDialog={isOpenedInfoDialog}
            message={"It looks like you have not had the required accounts yet, please navigate to pStore.App to create or import first."}
            onOk={this.closeInfoDialog}
          />
        </div>
      );
    }

    return (
      <BrowserRouter>
        <div style={styles.root}>
          {this.buildAppBar()}
          <Switch>
            <Route exact path="/" component={WalletPage} />
            <Route exact path="/wallets" component={WalletPage} />
            <Route exact path="/sign" component={SignPage} />
            {/* <Route exact path="/history" component={HistoryPage} /> */}
            <Route component={NotFoundPage} />
          </Switch>
          {requestings > 0 &&
            <Loader isActive={true} />
          }
          <GlobalStyle />
        </div>
      </BrowserRouter>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onLoadAccounts: (loadedWalletData) => dispatch(loadAccountsThunk(loadedWalletData)),
    onToggleInfoDialog: () => dispatch(toggleInfoDialog()),
    onToggleAccountInfo: () => dispatch(toggleAccountInfo()),
    onCloseAccountInfo: () => dispatch(closeAccountInfo()),
    onEnableMetaMask: () => dispatch(enableMetaMask()),
  };
}

const mapStateToProps = createStructuredSelector({
  isAccountInfoOpened: makeSelectIsAccountInfoOpened(),
  isLoadWalletDone: makeSelectIsLoadWalletDone(),
  ethAccount: makeSelectETHAccount(),
  tempIncAccount: makeSelectTempIncAccount(),
  privateIncAccount: makeSelectPrivateIncAccount(),
  isOpenedInfoDialog: makeSelectIsOpenedInfoDialog(),
  requestings: makeSelectRequestings(),
  deployedTokens: makeSelectDeployedTokens(),
  generatedETHAccFromIncAcc: makeSelectGeneratedETHAccFromIncAcc(),
  metaMask: makeSelectMetaMask(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withReducer = injectReducer({ key: 'app', reducer });

const withStylesApp = withStyles(styles);
const withWidthApp = withWidth();

export default compose(
  // withReducer,
  withConnect,
  withStylesApp,
  withWidthApp,
)(App);
