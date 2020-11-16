/*
 * App reducer
 */

import {
  CREATE_PRIVATE_INC_ACCOUNT,
  IMPORT_PRIVATE_INC_ACCOUNT,
  CREATE_TEMP_INC_ACCOUNT,
  IMPORT_TEMP_INC_ACCOUNT,
  IMPORT_ETH_ACCOUNT,
  CREATE_ETH_ACCOUNT,
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

import {
  PRIVATE_INC_ACC_NAME,
  TEMP_INC_ACC_NAME
} from "./constants";

import { getIncKeyAccountByName } from '../../services/incognito/wallet';
import { getKeysFromAccount } from '../../services/eth/wallet';
import { genETHAccFromIncPrivKey } from '../../common/utils';

// The initial state of the ShieldingPage
export const initialState = {
  error: null,
  isLoadWalletDone: false,
  ethAccount: {
    address: '',
    pubicKey: '',
    privateKey: '',
  },
  tempIncAccount: {
    address: '',
    pubicKey: '',
    privateKey: '',
  },
  privateIncAccount: {
    address: '',
    pubicKey: '',
    privateKey: '',
  },
  generatedETHAccFromIncAcc: {
    address: '',
    pubicKey: '',
    privateKey: '',
  },
  isOpenedInfoDialog: false,
  isAccountInfoOpened: false,
  requestings: 0,
  deployedTokens: [],
  metaMask: {
    isMetaMaskEnabled: false,
    metaMaskRequiredMess: null,
    metaMaskAccounts: null,
    chainId: 1,
  }
};

function addETHAccount(state, action) {
  const { ethAccountKey = {} } = action;

  return {
    ...state,
    ethAccount: {
      privateKey: ethAccountKey.privateKey,
      publicKey: ethAccountKey.pubicKey,
      address: ethAccountKey.address
    }
  }
}

function addPrivateIncAccount(state, action) {
  const { accountKey } = action;
  return {
    ...state,
    privateIncAccount : {
      address: accountKey.address,
      pubicKey: accountKey.publicKey,
      privateKey: accountKey.privateKey,
    }
  }
}

function addTempIncAccount(state, action) {
  const { accountKey } = action;
  return {
    ...state,
    tempIncAccount : {
      address: accountKey.address,
      pubicKey: accountKey.publicKey,
      privateKey: accountKey.privateKey,
    }
  }
}

export function updateAccounts(state, { incWallet, ethAccount, deployedTokens }) {
  let eAccount = {};
  let privIncAccount = {};
  let generatedETHAccFromIncAcc = {};
  let tIncAccount = {};
  // if (ethAccount && ethAccount.privateKey) {
  //   const keys = getKeysFromAccount(ethAccount);
  //   eAccount = {
  //     address: keys.address,
  //     publicKey: keys.publicKey,
  //     privateKey: keys.privateKey,
  //   };
  // }

  const privateIncAccount = incWallet ? getIncKeyAccountByName(PRIVATE_INC_ACC_NAME, incWallet) : null;
  if (privateIncAccount) {
    privIncAccount = {
      address: privateIncAccount.address,
      publicKey: privateIncAccount.publicKey,
      privateKey: privateIncAccount.privateKey,
    };
    const ethWallet = genETHAccFromIncPrivKey(privateIncAccount.privateKey);
    generatedETHAccFromIncAcc = {
      address: ethWallet.getAddressString(),
      publicKey: ethWallet.getPublicKeyString(),
      privateKey: ethWallet.getPrivateKeyString(),
    };
  }

  const tempIncAccount = incWallet ? getIncKeyAccountByName(TEMP_INC_ACC_NAME, incWallet) : null;
  if (tempIncAccount) {
    tIncAccount = {
      address: tempIncAccount.address,
      publicKey: tempIncAccount.publicKey,
      privateKey: tempIncAccount.privateKey,
    };
  }

  return {
    ...state,
    ethAccount: eAccount,
    tempIncAccount: tIncAccount,
    privateIncAccount: privIncAccount,
    generatedETHAccFromIncAcc,
    isLoadWalletDone: true,
    // isOpenedInfoDialog: !eAccount.privateKey || !tIncAccount.privateKey || !privIncAccount.privateKey,
    isOpenedInfoDialog: !privIncAccount.privateKey,
    deployedTokens,
  };
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_ETH_ACCOUNT:
      return addETHAccount(state, action);
    case IMPORT_ETH_ACCOUNT:
      return addETHAccount(state, action);
    case CREATE_PRIVATE_INC_ACCOUNT:
      return addPrivateIncAccount(state, action);
    case IMPORT_PRIVATE_INC_ACCOUNT:
      return addPrivateIncAccount(state, action);
    case CREATE_TEMP_INC_ACCOUNT:
      return addTempIncAccount(state, action);
    case IMPORT_TEMP_INC_ACCOUNT:
      return addTempIncAccount(state, action);

    case LOAD_ACCOUNTS_SUCCESS:
      return updateAccounts(state, action);
    case LOAD_ACCOUNTS_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case LOAD_DEPLOYED_TOKENS_SUCCESS:
      return {
        ...state,
        deployedTokens: action.deployedTokens,
      };
    case LOAD_DEPLOYED_TOKENS_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case TOGGLE_INFO_DIALOG:
      return {
        ...state,
        isOpenedInfoDialog: !state.isOpenedInfoDialog,
      };
    case TOGGLE_ACCOUNT_INFO:
      return {
        ...state,
        isAccountInfoOpened: !state.isAccountInfoOpened,
      };
    case CLOSE_ACCOUNT_INFO:
      return {
        ...state,
        isAccountInfoOpened: false,
      };

    case COUNT_UP_REQUESTS:
      return {
        ...state,
        requestings: state.requestings + 1,
      };
    case COUNT_DOWN_REQUESTS:
      return {
        ...state,
        requestings: state.requestings - 1,
      };
    case ENABLE_META_MASK_ACCOUNTS:
      return {
        ...state,
        metaMask: {
          ...state.metaMask,
          isMetaMaskEnabled: action.metaMask.isMetaMaskEnabled,
          metaMaskRequiredMess: action.metaMask.metaMaskRequiredMess,
          metaMaskAccounts: action.metaMask.metaMaskAccounts,
          chainId: action.metaMask.chainId,
        }
      }

    default:
      return state;
  }
}

export default appReducer;
