/**
 * Wallet Page selectors
 */

import { createSelector } from 'reselect';

const selectWallet = state => state.wallet; // 'wallet' here should match to registered reducer name in index.js

const makeSelectRowPerPage = () =>
  createSelector(
    selectWallet,
    walletState => walletState.rowsPerPage,
  );

const makeSelectRows = () =>
  createSelector(
    selectWallet,
    walletState => walletState.rows,
  );

const makeSelectValidateForm = () =>
  createSelector(
    selectWallet,
    walletState => walletState.validateForm,
  );

const makeSelectPage = () =>
  createSelector(
    selectWallet,
    walletState => walletState.page,
  );

const makeSelectNewWalletModal = () =>
  createSelector(
    selectWallet,
    walletState => walletState.isNewWalletOpen,
  );

const makeSelectFundModal = () =>
  createSelector(
    selectWallet,
    walletState => walletState.isFundOpen,
  );

const makeSelectWithdrawModal = () =>
  createSelector(
    selectWallet,
    walletState => walletState.isWithdrawOpen,
  );

const makeSelectNewWalletModalForm = () =>
  createSelector(
    selectWallet,
    walletState => walletState.newWalletFormInfo,
  );

const makeSelectWalletIsListening = () =>
  createSelector(
    selectWallet,
    walletState => walletState.isListening,
  );

const makeSelectWalletSelected = () =>
  createSelector(
    selectWallet,
    walletState => walletState.walletSelected,
  );

const makeSelectFormFund = () =>
  createSelector(
    selectWallet,
    walletState => walletState.fundFormInfo,
  );

const makeSelectFormWithdraw = () =>
  createSelector(
    selectWallet,
    walletState => walletState.withdrawFormInfo,
  );

const makeSelectFormWithdrawStep2 = () =>
  createSelector(
    selectWallet,
    walletState => walletState.withdrawFormInfoStep2,
  );

const makeSelectWithdrawStep = () =>
  createSelector(
    selectWallet,
    walletState => walletState.withdrawStep,
  );

const makeSelectEventFundWithdraw = () =>
  createSelector(
    selectWallet,
    walletState => {
      if (walletState) {
        return walletState.eventFundWithdraw
      }
      return null;
    },
  );

const makeSelectRowDetailSelected = () =>
  createSelector(
    selectWallet,
    walletState => walletState.rowDetailSelected,
  );

export {
  makeSelectRowPerPage,
  makeSelectRows,
  makeSelectPage,
  makeSelectValidateForm,
  makeSelectNewWalletModal,
  makeSelectNewWalletModalForm,
  makeSelectWalletIsListening,
  makeSelectFundModal,
  makeSelectWithdrawModal,
  makeSelectWalletSelected,
  makeSelectFormWithdraw,
  makeSelectFormFund,
  makeSelectFormWithdrawStep2,
  makeSelectWithdrawStep,
  makeSelectEventFundWithdraw,
  makeSelectRowDetailSelected,
};

