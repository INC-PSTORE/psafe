/*
 * Sign Page reducer
 */

import {
  CHANGE_SIGNATURE,
  CHANGE_VALIDATE_FORM,
  CHANGE_DATA_TO_SIGN,
  UPDATE_APPROVE_ROWS,
  UPDATE_SELECTED_ROW,
} from './constants';
import {func} from "prop-types";
import {UPDATE_WALLETS_ROWS} from "../Wallets/constants";

// The initial state of the ShieldingPage
export const initialState = {
  error: null,
  dataToSign: '',
  signature: '',
  validateForm: null,
  rows: null,
  selectedRow: null,
};

function signReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VALIDATE_FORM:
      return {
        ...state,
        validateForm: action.validateForm,
      }
    case CHANGE_SIGNATURE:
      return {
        ...state,
        signature: action.signature,
      }
    case CHANGE_DATA_TO_SIGN:
      return {
        ...state,
        dataToSign: action.dataToSign,
      }
    case UPDATE_APPROVE_ROWS:
      return {
        ...state,
        rows: action.rows,
      }
    case UPDATE_SELECTED_ROW:
      return {
        ...state,
        selectedRow: action.selectedRow,
      }
    default:
      return state;
  }
}

export default signReducer;