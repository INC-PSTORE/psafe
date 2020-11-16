/*
* App middlewares
*/

import Web3 from 'web3';
import { setupIncWallet, getIncKeyAccountByName } from '../../services/incognito/wallet';
import {
  getETHAccountFromPrivateKeyStr,
} from '../../services/eth/wallet';
import {
  loadAccountsSuccess,
  loadAccountsFailure,
  loadDeployedTokensSuccess,
  loadDeployedTokensFailure,
  updateMetaMask,
} from './actions';

import { ETH_PRIVATE_KEY_FIELD_NAME, INC_WALLET_FIELD_NAME, PRIVATE_INC_ACC_NAME } from './constants';
import { countUpRequests, countDownRequests } from './actions';

import {
  getDefaultSupportedTokens,
  getIncognitoContractAddr,
  genETHAccFromIncPrivKey,
  getIncContractABI,
  getETHFullnodeHost,
} from '../../common/utils';

function getSupportedTokens() {
  const supportedTokens = getDefaultSupportedTokens();
  return supportedTokens.filter(token => !!token.extTokenId).map(token => ({
    tokenId: token.extTokenId,
    tokenName: token.tokenName,
    eDecimals: token.eDecimals,
    icon: token.icon,
  }));
}

export function loadAccountsThunk(loadedWalletData) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    try {
      // load ETH private key
      // let ethAccount;
      // const ethPrivateKey = loadedWalletData[ETH_PRIVATE_KEY_FIELD_NAME];
      // if (ethPrivateKey) {
      //   ethAccount = getETHAccountFromPrivateKeyStr(ethPrivateKey);
      // }

      // load Inc Wallet from local storage
      let incWallet;
      const incWalletData = loadedWalletData[INC_WALLET_FIELD_NAME];
      if (incWalletData) {
        incWallet = await setupIncWallet(incWalletData);
      }

      let deployedTokens = [];
      const privateIncAccount = incWallet ? getIncKeyAccountByName(PRIVATE_INC_ACC_NAME, incWallet) : null;
      if (privateIncAccount) {
        const ethWallet = genETHAccFromIncPrivKey(privateIncAccount.privateKey);

        const incContractAddr = getIncognitoContractAddr();
        const web3 = new Web3(getETHFullnodeHost());
        const incContract = new web3.eth.Contract(getIncContractABI(), incContractAddr);
        const supportedTokens = getSupportedTokens();
        for (const token of supportedTokens) {
          const balance = await incContract.methods.getDepositedBalance(token.tokenId, ethWallet.getAddressString()).call();
          const convertedBal = balance / (10 ** token.eDecimals);
          const newToken = {
            ...token,
            deployedBalance: convertedBal,
          };
          deployedTokens.push(newToken);
        }
      }

      dispatch(loadAccountsSuccess(null, incWallet, deployedTokens));

    } catch (e) {
      console.log('error occured while loading accounts: ', e);
      dispatch(loadAccountsFailure(e));
    }
    dispatch(countDownRequests());
  };
}

export function loadDeployedTokensThunk(generatedETHAddress) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    try {
      let deployedTokens = [];

      const incContractAddr = getIncognitoContractAddr();
      const web3 = new Web3(getETHFullnodeHost());
      const incContract = new web3.eth.Contract(getIncContractABI(), incContractAddr);
      const supportedTokens = getSupportedTokens();
      for (const token of supportedTokens) {
        const balance = await incContract.methods.getDepositedBalance(token.tokenId, generatedETHAddress).call();
        const convertedBal = balance / (10 ** token.eDecimals);
        const newToken = {
          ...token,
          deployedBalance: convertedBal,
        };
        deployedTokens.push(newToken);
      }
      dispatch(loadDeployedTokensSuccess(deployedTokens));
    } catch (error) {
      console.log('error occured while loading deployed tokens: ', error);
      dispatch(loadDeployedTokensFailure(error));
    }
    dispatch(countDownRequests());
  };
}

export function enableMetaMask() {
  return async (dispatch, getState) => {
    let metaMask = getState().app.metaMask;
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.enable();
        if (!accounts || accounts.length === 0) {
          return false;
        }
        metaMask.isMetaMaskEnabled = true;
        metaMask.metaMaskAccounts = accounts;
        metaMask.chainId = window.ethereum.chainId;
        if (metaMask.chainId !== "0x2a") {
          metaMask.metaMaskRequiredMess = "Only Kovan testnet supported on psafe!";
        }
      } catch (error) {
        metaMask.metaMaskRequiredMess = "App error can not connect to metamask. Please try again";
        if (error.code === -32002) {
          metaMask.metaMaskRequiredMess = "Please check meta mask extension to give us permission";
        }
        metaMask.isMetaMaskEnabled = false;
        metaMask.metaMaskAccounts = null;
      }
    } else {
      metaMask.metaMaskRequiredMess = "Need meta mask installed and enabled to use awesome features";
      metaMask.isMetaMaskEnabled = false;
      metaMask.metaMaskAccounts = null;
    }
    if (metaMask.isMetaMaskEnabled) {
      window.ethereum.on('chainChanged', (chainId) => {
        metaMask.chainId = chainId;
        if (chainId !== "0x2a") {
          metaMask.metaMaskRequiredMess = "Only Kovan testnet supported on psafe!";
        }
        if(metaMask.isMetaMaskEnabled) {
          dispatch(updateMetaMask(metaMask));
        }
      });
    }
    dispatch(updateMetaMask(metaMask));
  }
}