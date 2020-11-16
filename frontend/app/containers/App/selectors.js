import { createSelector } from 'reselect';

// router state
const selectRouter = state => state.router;

const makeSelectLocation = () => createSelector(selectRouter, routerState => routerState.location);

// app state
const selectApp = state => state.app;

const makeSelectETHAccount = () => createSelector(selectApp, appState => appState.ethAccount);
const makeSelectTempIncAccount = () => createSelector(selectApp, appState => appState.tempIncAccount);
const makeSelectPrivateIncAccount = () => createSelector(selectApp, appState => appState.privateIncAccount);

const makeSelectETHPrivateKey = () => createSelector(selectApp, appState => appState.ethAccount.privateKey);
const makeSelectPrivIncAccPrivateKey = () => createSelector(selectApp, appState => appState.privateIncAccount.privateKey);
const makeSelectTempIncAccPrivateKey = () => createSelector(selectApp, appState => appState.tempIncAccount.privateKey);
const makeSelectIsLoadWalletDone = () => createSelector(selectApp, appState => appState.isLoadWalletDone);

const makeSelectIsOpenedInfoDialog = () => createSelector(selectApp, appState => appState.isOpenedInfoDialog);
const makeSelectIsAccountInfoOpened = () => createSelector(selectApp, appState => appState.isAccountInfoOpened);

const makeSelectRequestings = () => createSelector(selectApp, appState => appState.requestings);
const makeSelectDeployedTokens = () => createSelector(selectApp, appState => appState.deployedTokens);
const makeSelectGeneratedETHAccFromIncAcc = () => createSelector(selectApp, appState => appState.generatedETHAccFromIncAcc);
const makeSelectMetaMask = () => createSelector(selectApp, appState => appState.metaMask);

export {
  makeSelectLocation,
  makeSelectETHAccount,
  makeSelectTempIncAccount,
  makeSelectPrivateIncAccount,

  makeSelectETHPrivateKey,
  makeSelectPrivIncAccPrivateKey,
  makeSelectTempIncAccPrivateKey,

  makeSelectIsLoadWalletDone,
  makeSelectIsOpenedInfoDialog,

  makeSelectRequestings,
  makeSelectIsAccountInfoOpened,
  makeSelectDeployedTokens,
  makeSelectGeneratedETHAccFromIncAcc,
  makeSelectMetaMask,
};
