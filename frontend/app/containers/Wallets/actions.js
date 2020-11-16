/*
 * Wallets Page actions
 */

import {
  UPDATE_WALLETS_PAGE,
  UPDATE_WALLETS_ROWS_PER_PAGE,
  UPDATE_VALIDATE_INPUT,
  UPDATE_WALLETS_MODAL,
  UPDATE_WALLETS_MODAL_FORM,
  UPDATE_WALLETS_ROWS,
  UPDATE_WALLETS_EVENT_LISTENING,
  UPDATE_WALLET_SELECTED,
  UPDATE_WALLETS_FUND,
  UPDATE_WALLETS_WITHDRAW,
  UPDATE_WALLET_WITHDRAW_STEP2,
  UPDATE_WALLET_WITHDRAW_STEP,
  UPDATE_FUN_WITHDRAW_EVENTS,
  UPDATE_ROW_BY_INDEX,
  UPDATE_WALLET_SELECTED_DETAIL,
} from './constants';

export function updateValidateForm(validateForm) {
  return {
    type: UPDATE_VALIDATE_INPUT,
    validateForm,
  }
}

export function onChangePage(page) {
  return {
    type: UPDATE_WALLETS_PAGE,
    page,
  }
}

export function onChangeRowsPerPage(page, rowsPerPage) {
  return {
    type: UPDATE_WALLETS_ROWS_PER_PAGE,
    rowsPerPage,
    page,
  }
}

export function onChangeModal(modal, value) {
  return {
    type: UPDATE_WALLETS_MODAL,
    modal,
    value,
  }
}

export function onChangeNewWalletForm(newWalletForm) {
  return {
    type: UPDATE_WALLETS_MODAL_FORM,
    newWalletForm,
  }
}

export function onChangeRows(rows) {
  return {
    type: UPDATE_WALLETS_ROWS,
    rows,
  }
}

export function onChangeListening(isListening) {
  return {
    type: UPDATE_WALLETS_EVENT_LISTENING,
    isListening,
  }
}

export function onChangeWalletSelected(walletSelected) {
  return {
    type: UPDATE_WALLET_SELECTED,
    walletSelected,
  }
}

export function onChangeFundForm(formInfo){
  return {
    type: UPDATE_WALLETS_FUND,
    formInfo,
  }
}

export function onChangeWithdrawForm(formInfo) {
  return {
    type: UPDATE_WALLETS_WITHDRAW,
    formInfo,
  }
}

export function onChangeWithdrawFormStep2(formInfo) {
  return {
    type: UPDATE_WALLET_WITHDRAW_STEP2,
    formInfo,
  }
}

export function onChangeWithdrawStep(withdrawStep) {
  return {
    type: UPDATE_WALLET_WITHDRAW_STEP,
    withdrawStep,
  }
}

export function onChangeEventFundWithdraw(eventFundWithdraw) {
  return {
    type: UPDATE_FUN_WITHDRAW_EVENTS,
    eventFundWithdraw,
  }
}

export function onChangeDetailWallet(rowDetailSelected) {
  return {
    type: UPDATE_WALLET_SELECTED_DETAIL,
    rowDetailSelected,
  }
}

export function onChangeRow(i, withdrawRequest) {
  return {
    type: UPDATE_ROW_BY_INDEX,
    i,
    withdrawRequest,
  }
}