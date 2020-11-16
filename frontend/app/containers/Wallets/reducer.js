/*
 * Wallet Page reducer
 */

import {
  UPDATE_WALLETS_PAGE,
  UPDATE_WALLETS_ROWS_PER_PAGE,
  UPDATE_WALLETS_MODAL,
  UPDATE_VALIDATE_INPUT,
  UPDATE_WALLETS_MODAL_FORM,
  UPDATE_WALLETS_ROWS,
  UPDATE_WALLETS_EVENT_LISTENING,
  UPDATE_WALLETS_FUND,
  UPDATE_WALLETS_WITHDRAW,
  UPDATE_WALLET_SELECTED,
  UPDATE_WALLET_WITHDRAW_STEP2,
  UPDATE_WALLET_WITHDRAW_STEP,
  UPDATE_FUN_WITHDRAW_EVENTS,
  UPDATE_WALLET_SELECTED_DETAIL,
  UPDATE_ROW_BY_INDEX,
} from './constants';
import {func} from "prop-types";

// The initial state of the WalletPage
export const initialState = {
  error: null,
  counter: 0,
  page: 0,
  rowsPerPage: 10,
  rows: [],
  eventFundWithdraw: [],
  walletSelected: null,
  isListening: false,
  isFundOpen: false,
  isNewWalletOpen: false,
  isWithdrawOpen: false,
  newWalletFormInfo: {
    owners: ["0x0000000000000000000000000000000000000000"],
    requirement: 0,
  },
  fundFormInfo: {
    tokenId: '',
    amount: 0,
  },
  withdrawFormInfo: {
    tokenId: '',
    amount: 0,
  },
  withdrawFormInfoStep2: null,
  withdrawStep: 1,
  ethTxInfo: null,
  validateForm: null,
  rowDetailSelected: null,
};

function updateWalletModal(state, action) {
  const {modal, value} = action;
  switch (modal) {
    case 1:
      return {
        ...state,
        isNewWalletOpen: value,
      }
    case 2:
      return {
        ...state,
        isFundOpen: value,
      }
    default:
      return {
        ...state,
        isWithdrawOpen: value,
      }
  }
}

function walletReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_VALIDATE_INPUT:
      return {
        ...state,
        validateForm: action.validateForm,
      }
    case UPDATE_WALLETS_PAGE:
      return {
        ...state,
        page: action.page,
      }
    case UPDATE_WALLETS_ROWS_PER_PAGE:
      return {
        ...state,
        page: action.page,
        rowsPerPage: action.rowsPerPage,
      }
    case UPDATE_WALLETS_MODAL:
      return updateWalletModal(state, action);
    case UPDATE_WALLETS_MODAL_FORM:
      return {
        ...state,
        newWalletFormInfo : {
          owners: action.newWalletForm.owners,
          requirement: action.newWalletForm.requirement,
        }
      }
    case UPDATE_WALLETS_ROWS:
      return {
        ...state,
        rows: action.rows,
      }
    case UPDATE_ROW_BY_INDEX:
      return {
        ...state,
        rows: state.rows.map(
          (row, i) => i === action.i ? {...row, withdrawRequest: action.withdrawRequest}
            : row
        )
      }
    case UPDATE_WALLETS_EVENT_LISTENING:
      return {
        ...state,
        isListening: action.isListening,
      }
    case UPDATE_WALLETS_FUND:
      return {
        ...state,
        fundFormInfo: {
          tokenId: action.formInfo.tokenId,
          amount: action.formInfo.amount,
        }
      }
    case UPDATE_WALLETS_WITHDRAW:
      return {
        ...state,
        withdrawFormInfo: {
          tokenId: action.formInfo.tokenId,
          amount: action.formInfo.amount,
        }
      }
    case UPDATE_WALLET_SELECTED:
      return {
        ...state,
        walletSelected: action.walletSelected,
      }
    case UPDATE_WALLET_WITHDRAW_STEP2:
      return {
        ...state,
        withdrawFormInfoStep2: action.formInfo,
      }
    case UPDATE_WALLET_WITHDRAW_STEP:
      return {
        ...state,
        withdrawStep: action.withdrawStep,
      }
    case UPDATE_FUN_WITHDRAW_EVENTS:
      return {
        ...state,
        eventFundWithdraw: action.eventFundWithdraw,
      }
    case UPDATE_WALLET_SELECTED_DETAIL:
      return {
        ...state,
        rowDetailSelected: action.rowDetailSelected,
      }
    default:
      return state;
  }
}

export default walletReducer;