/*
 * Sign Page actions
 */

import {
  CHANGE_SIGNATURE,
  CHANGE_VALIDATE_FORM,
  CHANGE_DATA_TO_SIGN,
  UPDATE_APPROVE_ROWS,
  UPDATE_SELECTED_ROW,
} from './constants';
import {sigMess} from '../Wallets/middlewares';

export function updateValidateForm(validateForm) {
  return {
    type: CHANGE_VALIDATE_FORM,
    validateForm,
  }
}

export function updateDataToSign(dataToSign, ethAccount) {
  return async (dispatch, getState) => {
    try {
      let signature = sigMess(dataToSign, ethAccount.privateKey);
      dispatch(updateSignature(signature));
    } catch (e)  {
      console.log("Sign message got error: ", e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Invalid hex string. Must be hex string 32 bytes!"}}));
    }
    dispatch(updateDataToSignInternal(dataToSign));
  }
}

export function updateDataToSignInternal(dataToSign) {
  return {
    type: CHANGE_DATA_TO_SIGN,
    dataToSign,
  }
}

export function updateSignature(signature) {
  return {
    type: CHANGE_SIGNATURE,
    signature,
  }
}

export function updateRows(rows) {
  return {
    type: UPDATE_APPROVE_ROWS,
    rows,
  }
}

export function updateSelectedRow(selectedRow) {
  return {
    type: UPDATE_SELECTED_ROW,
    selectedRow,
  }
}