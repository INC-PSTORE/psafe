
import {
  HANDLE_FAILURE_GLOBALLY,
  CREATE_PRIVATE_INC_ACCOUNT,
  IMPORT_PRIVATE_INC_ACCOUNT,
  CREATE_TEMP_INC_ACCOUNT,
  IMPORT_TEMP_INC_ACCOUNT,
  CREATE_ETH_ACCOUNT,
  IMPORT_ETH_ACCOUNT,
  LOAD_ACCOUNTS_SUCCESS,
  LOAD_ACCOUNTS_FAILURE,
  LOAD_DEPLOYED_TOKENS_SUCCESS,
  LOAD_DEPLOYED_TOKENS_FAILURE,
  TOGGLE_INFO_DIALOG,
  TOGGLE_ACCOUNT_INFO,
  CLOSE_ACCOUNT_INFO,
  COUNT_UP_REQUESTS,
  COUNT_DOWN_REQUESTS,
  ENABLE_META_MASK_ACCOUNTS,
 } from './constants';

import { getIncKeyAccountByName } from '../../services/incognito/wallet';
import { PRIVATE_INC_ACC_NAME, TEMP_INC_ACC_NAME } from './constants';
import { createNewAccount, getIncKeyFromAccount, importAccount } from '../../services/incognito/wallet';
import { createNewETHAccount, getKeysFromAccount, importETHAccount } from '../../services/eth/wallet';

export function handleFailureGlobally(error) {
  return {
    type: HANDLE_FAILURE_GLOBALLY,
    error,
  };
}

export function createPrivateIncAccountAction() {
  return async function(dispatch) {
    const account = await createNewAccount(PRIVATE_INC_ACC_NAME);
    dispatch({
      type: CREATE_PRIVATE_INC_ACCOUNT,
      accountKey: getIncKeyFromAccount(account)
    })
  };
}

export function importPrivateIncAccountAction(privateKeyStr) {
  return async function(dispatch) {
    const account = await importAccount(PRIVATE_INC_ACC_NAME, privateKeyStr);
    dispatch({
      type: IMPORT_PRIVATE_INC_ACCOUNT,
      accountKey: getIncKeyFromAccount(account)
    })
  };
}


export function createTempIncAccountAction() {
  return async function(dispatch) {
    const account = await createNewAccount(TEMP_INC_ACC_NAME);
    dispatch({
      type: CREATE_TEMP_INC_ACCOUNT,
      accountKey: getIncKeyFromAccount(account)
    })
  };
}

export function importTempIncAccountAction(privateKeyStr) {
  return async function(dispatch) {
    const account = await importAccount(TEMP_INC_ACC_NAME, privateKeyStr);

    dispatch({
      type: IMPORT_TEMP_INC_ACCOUNT,
      accountKey: getIncKeyFromAccount(account)
    })
  };
}

export function createETHAccountAction() {
  let ethAccount = createNewETHAccount();
  let ethAccountKey = getKeysFromAccount(ethAccount);
  return {
    type: CREATE_ETH_ACCOUNT,
    ethAccountKey,
  }
}

export function importETHAccountAction(privateKey) {
  let ethAccount = importETHAccount(privateKey);
  let ethAccountKey = getKeysFromAccount(ethAccount);

  return {
    type: IMPORT_ETH_ACCOUNT,
    ethAccountKey,
  }
}


export function loadAccountsSuccess(ethAccount, incWallet, deployedTokens) {
  return {
    type: LOAD_ACCOUNTS_SUCCESS,
    ethAccount,
    incWallet,
    deployedTokens,
  }
}
export function loadAccountsFailure(error) {
  return {
    type: LOAD_ACCOUNTS_FAILURE,
    error,
  }
}

export function loadDeployedTokensSuccess(deployedTokens) {
  return {
    type: LOAD_DEPLOYED_TOKENS_SUCCESS,
    deployedTokens,
  }
}
export function loadDeployedTokensFailure(error) {
  return {
    type: LOAD_DEPLOYED_TOKENS_FAILURE,
    error,
  }
}

export function toggleInfoDialog() {
  return {
    type: TOGGLE_INFO_DIALOG,
  }
}

export function countUpRequests() {
  return {
    type: COUNT_UP_REQUESTS,
  }
}

export function countDownRequests() {
  return {
    type: COUNT_DOWN_REQUESTS,
  }
}


export function toggleAccountInfo() {
  return {
    type: TOGGLE_ACCOUNT_INFO,
  }
}
export function closeAccountInfo() {
  return {
    type: CLOSE_ACCOUNT_INFO,
  }
}

export function updateMetaMask(metaMask) {
  return {
    type: ENABLE_META_MASK_ACCOUNTS,
    metaMask,
  }
}
