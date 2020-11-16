/*
* Wallet middlewares
*/

import Web3 from 'web3';

import {
  makeCall,
  buildOptions,
} from '../../utils/api-call';

import {
  createNewWithdrawRequest,
  getPendingRequest,
  getApprovedRequest,
  updateWithdrawRequest,
} from '../../utils/api-routes';

import {
  updateValidateForm,
  onChangeRows,
  onChangeModal,
  onChangeWithdrawStep,
  onChangeWithdrawFormStep2,
  onChangeEventFundWithdraw,
  onChangeDetailWallet,
  onChangeRow,
} from './actions';

import {
  loadDeployedTokensThunk,
} from '../App/middlewares';

import {
  getETHFullnodeHost,
  getMultisigContractAddr,
  getMultisigContractABI,
  getIncognitoContractAddr,
  getMultisigAdapterContractABI,
  getMultisigAdapterContractAddr,
  getIncContractABI,
  getINFURAWSS,
  getDefaultSupportedTokens,
} from '../../common/utils';

import {
  HANDLE_FAILURE_GLOBALLY,
} from '../App/constants'

import {countDownRequests, countUpRequests} from "../App/actions";
import {APPROVED, ETHER_ID, PENDING, REJECTED, TEMP_ID} from "../../common/constants";
import en from "react-intl/src/en";

const eutil = require('ethereumjs-util');
const web3 = new Web3(getETHFullnodeHost());

export function createNewWalletThunk(ethAccount, newWalletInfo) {
  return async (dispatch, getState) => {
    let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
    if (newWalletInfo.owners.length < newWalletInfo.requirement) {
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Number of owners less than requirement"}}));
      return {
        type: HANDLE_FAILURE_GLOBALLY,
        error: "Number of owners less than requirement",
      };
    }

    for(var i = 0; i < newWalletInfo.owners.length; i++) {
      if(!web3.utils.isAddress(newWalletInfo.owners[i].toLowerCase())) {
        dispatch(updateValidateForm({snackBar: {isError: true, message: "One of owner's address is invalid"}}));
        return {
          type: HANDLE_FAILURE_GLOBALLY,
          error: "Owner's addresses duplicated!",
        };
      }
    }

    if (checkIfDuplicateExists(newWalletInfo.owners)) {
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Owners duplicated"}}));
      return {
        type: HANDLE_FAILURE_GLOBALLY,
        error: "Owner's addresses duplicated!",
      };
    }
    dispatch(countUpRequests());
    try {
      newWalletInfo.amount = 0;
      newWalletInfo.tokenId = ETHER_ID;
      const txObject = await CreateEthRawTransaction(generatedETHAcc, newWalletInfo, 1);
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      ethAccount = {address: accounts[0]};
      // txObject.nonce = await web3.eth.getTransactionCount(ethAccount.address);
      // txObject.nonce += '';
      txObject.from = ethAccount.address;
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txObject],
      });

      dispatch(onChangeModal(1, false));
      dispatch(updateValidateForm({snackBar: {isSuccess: true, message: "Created New Wallet transaction successfully!"}}));
    } catch (e) {
      console.log('error occured while run create new wallet thunk: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  };
}

const getBalance = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
  },
];

export function fundThunk(walletSelected, formFund, ethAccount) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    try {
      let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
      if (formFund.tokenId === '') {
        dispatch(countDownRequests());
        dispatch(updateValidateForm({snackBar: {isError: true, message: "Token type must be selected"}}));
        return {
          type: HANDLE_FAILURE_GLOBALLY,
          error: "Coin must be selected",
        };
      }
      let decimal = 18;
      if (formFund.tokenId !== ETHER_ID) {
        const tokenInstance = new web3.eth.Contract(getBalance, formFund.tokenId);
        decimal = await tokenInstance.methods.decimals().call();
      }
      const fundAmount = formFund.amount * 10 ** decimal;

      let yourVaultBalance = await incognitoContract.methods.getDepositedBalance(formFund.tokenId, generatedETHAcc.address).call();
      if (fundAmount > yourVaultBalance) {
        dispatch(countDownRequests());
        dispatch(updateValidateForm({snackBar: {isError: true, message: "Insufficient deployed balance!"}}));
        return {
          type: HANDLE_FAILURE_GLOBALLY,
          error: "Coin must be selected",
        };
      }
      let type = 3;
      if (formFund.tokenId === ETHER_ID) {
        type = 2;
      }
      const txObject = await CreateEthRawTransaction(generatedETHAcc, {
        amount: fundAmount,
        walletId: walletSelected.walletId,
        tokenId: formFund.tokenId
      }, type);
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      ethAccount = {address: accounts[0]};
      // txObject.nonce = await web3.eth.getTransactionCount(ethAccount.address);
      txObject.from = ethAccount.address;
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txObject],
      });
      dispatch(onChangeModal(2, false));
      formFund.amount = 0;
      dispatch(onChangeDetailWallet(null));
      dispatch(loadDeployedTokensThunk(generatedETHAcc.address));
      dispatch(updateValidateForm({snackBar: {isSuccess: true, message: "Created Fund transaction successfully!"}}));
    } catch (e) {
      console.log('error occured while run withdraw thunk api: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  }
}

export function withdrawThunk(walletSelected, formWithdrawStep2, ethAccount) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    try {
      let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
      let errorMess = null;
      for (var i = 0; i < formWithdrawStep2.signatures.length; i++) {
        if (!formWithdrawStep2.signatures[i] || formWithdrawStep2.signatures[i] === '0x0' || formWithdrawStep2.signatures[i].replace('0x', '').length !== 130) {
          errorMess = "Invalid signature!";
          break;
        }
        // check signer is owner of this wallet.
        let signer = await multisigContractReal.methods.sigToAddress(formWithdrawStep2.signatures[i], formWithdrawStep2.dataToSign).call();
        let isOwner = await multisigContractReal.methods.isOwnerOfWallet(walletSelected.walletId, signer).call();
        if (!isOwner) {
          errorMess = "One of these signers is not the owner of the wallet!";
          break;
        }
      }
      if (errorMess) {
        dispatch(countDownRequests());
        dispatch(updateValidateForm({snackBar: {isError: true, message: errorMess}}));
        return {
          type: HANDLE_FAILURE_GLOBALLY,
          error: errorMess,
        };
      }

      formWithdrawStep2.walletId = walletSelected.walletId;
      formWithdrawStep2.receiver = generatedETHAcc.address;
      const txObject = await CreateEthRawTransaction(generatedETHAcc, formWithdrawStep2, 4);
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      ethAccount = {address: accounts[0]};
      // txObject.nonce = await web3.eth.getTransactionCount(ethAccount.address);
      txObject.from = ethAccount.address;
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txObject],
      });

      const options = await buildOptions('PUT', {
        ethAddressStr: formWithdrawStep2.ethAddressStr,
        walletId: formWithdrawStep2.walletId,
        requirement: formWithdrawStep2.requirement,
        tokenId: formWithdrawStep2.tokenId,
        amount: formWithdrawStep2.amount + '',
        randomBytes: formWithdrawStep2.randomBytes,
        dataToSign: formWithdrawStep2.dataToSign,
        status: APPROVED,
      });
      await makeCall(
        dispatch,
        updateWithdrawRequest(formWithdrawStep2.withdrawId),
        options,
      );

      dispatch(onChangeRow(formWithdrawStep2.walletId - 1, null));
      dispatch(loadDeployedTokensThunk(generatedETHAcc.address));
      dispatch(onChangeDetailWallet(null));
      dispatch(updateValidateForm({snackBar: {isSuccess: true, message: "Created Withdraw transaction successfully!"}}));
    } catch (e) {
      console.log('error occured while run withdraw thunk api: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  }
}

export function listenEvent() {
  return async (dispatch, getState) => {
    try {
      dispatch(countUpRequests());
      const options = {
        timeout: 30000, // ms
        // Useful for credentialed urls, e.g: ws://username:password@localhost:8546
        headers: {
          // authorization: 'Basic username:password'
        },
        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
          // maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000 // ms
        },
        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 5,
          onTimeout: false
        }
      };
      const wwsWeb3 = new Web3(new Web3.providers.WebsocketProvider(getINFURAWSS(), options));
      const multisigContract = new wwsWeb3.eth.Contract(getMultisigContractABI(), getMultisigContractAddr());
      const latest = await web3.eth.getBlockNumber()
      // load past events
      const pastEvents = await multisigContract.getPastEvents('allEvents', {fromBlock: 20255921, toBlock: latest - 6});
      let eventFundWithdraw = getState().wallet.eventFundWithdraw;
      let rows = getState().wallet.rows;
      let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
      for (var i = 0; i < pastEvents.length; i++) {
        let returnValues = pastEvents[i].returnValues;
        if (pastEvents[i].event === 'NewWallet') {
          let row = {
            owners: returnValues.owners,
            requirements: returnValues.requirements,
            walletId: returnValues.walletId
          };
          let requestRes = await getRequestStatus(generatedETHAcc, row);
          if(!isEmpty(requestRes)) {
            row.withdrawRequest = requestRes;
          }
          rows.push(row);
        } else {
          let eventValue = {
            token: returnValues.token,
            amount: returnValues.amount,
            walletId: returnValues.walletId,
          }
          if (pastEvents[i].event === 'Withdraw') {
            eventValue.type = 'withdraw';
            eventValue.receiver = returnValues.receiver;
          } else {
            eventValue.type = 'fund';
          }
          eventFundWithdraw.push(eventValue);
        }
      }
      dispatch(onChangeRows(rows));
      dispatch(onChangeEventFundWithdraw(eventFundWithdraw));
      dispatch(countDownRequests());
      multisigContract.events.allEvents({
        fromBlock: latest - 5,
      }, function (error, event) {
        let rows = getState().wallet.rows;
        if (!error && !event.removed) {
          let returnValues = event.returnValues;
          if (event.event === "NewWallet") {
            rows.push({
              owners: returnValues.owners,
              requirements: returnValues.requirements,
              walletId: returnValues.walletId
            });
            dispatch(onChangeRows(rows));
          } else if (event.event === 'Withdraw' || event.event === 'Fund') {
            let allRows = getState().wallet.eventFundWithdraw;
            let eventValue = {
              token: returnValues.token,
              amount: returnValues.amount,
              walletId: returnValues.walletId,
            }
            if (event.event === 'Withdraw') {
              eventValue.type = 'withdraw';
              eventValue.receiver = returnValues.receiver;
            } else {
              eventValue.type = 'fund';
            }
            allRows.push(eventValue);
            dispatch(onChangeEventFundWithdraw(allRows));
          }
        }
      })
        .on('data', function (event) {
          console.log(event); // same results as the optional callback above
        })
        .on('changed', function (event) {
          // remove event from local database
        })
        .on('error', console.error);
    } catch (e) {
      console.log('error occured while listen event: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
      dispatch(countDownRequests());
    }
  }
}

const incContractAddr = getIncognitoContractAddr();
const multisigAdapterContract = getMultisigAdapterContractAddr();
const multisigContract = new web3.eth.Contract(getMultisigAdapterContractABI(), multisigAdapterContract);
const incognitoContract = new web3.eth.Contract(getIncContractABI(), incContractAddr);
const multisigContractReal = new web3.eth.Contract(getMultisigContractABI(), getMultisigContractAddr());
const SIGNATURE = "pMultiSig";

async function CreateEthRawTransaction(generatedETHAcc, data, type) {
  const amountBN = web3.utils.toBN(data.amount);
  let amountHex = web3.utils.toHex(amountBN);

  let multisigCallData;
  switch (type) {
    case 1:
      multisigCallData = multisigContract.methods.initMultiSigAddress(data.requirement, data.owners).encodeABI();
      break;
    case 2:
      multisigCallData = multisigContract.methods.sendEtherFund(data.walletId).encodeABI();
      break;
    case 3:
      // multisigCallData = multisigContract.methods.sendERC20Fund(data.walletId, data.tokenId, data.amount).encodeABI();
      multisigCallData = multisigContract.methods.sendERC20Fund(data.walletId, data.tokenId, amountHex).encodeABI();
      break;
    default:
      multisigCallData = multisigContract.methods.withdrawFund(data.walletId, data.signatures, data.receiverSignature, data.randomBytes, data.receiver, data.tokenId, amountHex).encodeABI();
      amountHex = 0;
  }
  // random data to create unique value
  let getTimestamp = (new Date()).getTime().toString(16);
  let randomBytes = '0x' + (getTimestamp.length % 2 === 0 ? getTimestamp : '0' + getTimestamp);
  let dataToSign = (multisigAdapterContract + multisigCallData + randomBytes + web3.utils.padLeft(amountHex, 64)).split("0x").join("");
  let hashData = web3.utils.keccak256("0x" + dataToSign)
  const signBytes = sigMess(hashData, generatedETHAcc.privateKey)
  // add temp id type to pass eth case => TODO: fix when vault upgraded
  // let callData = incognitoContract.methods.execute(data.tokenId, data.amount, type === 2 ? TEMP_ID : data.tokenId, multisigAdapterContract, multisigCallData, randomBytes, signBytes).encodeABI();
  let callData = incognitoContract.methods.execute(data.tokenId, amountHex, type === 2 ? TEMP_ID : data.tokenId, multisigAdapterContract, multisigCallData, randomBytes, signBytes).encodeABI();
  return {
    to: incContractAddr,
    data: callData,
  };
}

export function WithdrawStep2Thunk(ethAccount, walletSelected, formWithdraw) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    try {
      let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
      if (formWithdraw.tokenId === '') {
        dispatch(countDownRequests());
        dispatch(updateValidateForm({snackBar: {isError: true, message: "Token type must be selected"}}));
        return {
          type: HANDLE_FAILURE_GLOBALLY,
          error: "Token type must be selected",
        };
      }

      let decimal = 18;
      if (formWithdraw.tokenId !== ETHER_ID) {
        const tokenInstance = new web3.eth.Contract(getBalance, formWithdraw.tokenId);
        decimal = await tokenInstance.methods.decimals().call();
      }
      const withdrawAmount = formWithdraw.amount * 10 ** decimal;

      let balanceOnMultisigWallet = await multisigContractReal.methods.getDepositedBalance(walletSelected.walletId, formWithdraw.tokenId).call();
      if (withdrawAmount > balanceOnMultisigWallet) {
        dispatch(countDownRequests());
        dispatch(updateValidateForm({snackBar: {isError: true, message: "Insufficient balance on multisig wallet"}}));
        return {
          type: HANDLE_FAILURE_GLOBALLY,
          error: "Insufficient balance on multisig wallet",
        };
      }
      let getTimestamp = (new Date()).getTime().toString(16);
      let randomBytes = '0x' + (getTimestamp.length % 2 === 0 ? getTimestamp : '0' + getTimestamp);
      let signatures = [];
      let hexSIGNATURE = await web3.utils.utf8ToHex(SIGNATURE);
      let data = (hexSIGNATURE + generatedETHAcc.address + formWithdraw.tokenId + web3.utils.padLeft(withdrawAmount, 64) + randomBytes).split("0x").join("");
      let dataToSign = web3.utils.keccak256("0x" + data);
      const receiverSig = sigMess(dataToSign, generatedETHAcc.privateKey);
      let isOwner = await multisigContractReal.methods.isOwnerOfWallet(walletSelected.walletId, generatedETHAcc.address).call();
      let owners = walletSelected.owners.map(owner => owner.toLowerCase());
      if (isOwner) {
        signatures[0] = receiverSig;
        const index = owners.indexOf(generatedETHAcc.address.toLowerCase());
        if (index > -1) {
          owners.splice(index, 1);
        }
      }
      let formWithdrawStep2 = {};
      formWithdrawStep2.signatures = signatures;
      formWithdrawStep2.receiverSignature = receiverSig;
      formWithdrawStep2.dataToSign = dataToSign;
      formWithdrawStep2.randomBytes = randomBytes;
      formWithdrawStep2.amount = withdrawAmount;
      formWithdrawStep2.tokenId = formWithdraw.tokenId;
      formWithdrawStep2.ethAddressStr = generatedETHAcc.address.toLowerCase();
      const ownersLowerCases = owners.map(owner => owner.toLowerCase());
      const options = await buildOptions('POST', {
        ethAddressStr: generatedETHAcc.address.toLowerCase(),
        walletId: walletSelected.walletId + '',
        requirement: Number(walletSelected.requirements),
        tokenId: formWithdraw.tokenId,
        amount: withdrawAmount + '',
        randomBytes: randomBytes,
        owners: ownersLowerCases,
        dataToSign: dataToSign,
      });
      const withdrawRes = await makeCall(
        dispatch,
        createNewWithdrawRequest(),
        options,
      );
      formWithdrawStep2.withdrawId = withdrawRes.withdrawId;
      formWithdrawStep2.statusFromOwners = 0;
      if (formWithdrawStep2.signatures.length >= walletSelected.requirements) {
        formWithdrawStep2.statusFromOwners = 1;
      }
      dispatch(onChangeRow(walletSelected.walletId - 1, formWithdrawStep2));
      dispatch(onChangeModal(3, false));
      formWithdraw.amount = 0;
    } catch (e) {
      console.log('error occured while withdraw step2 api: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  }
}

export function sigMess(mess, privateKey) {
  let dataToSigBuff = Buffer.from(mess.replace('0x', ''), "hex");
  let privateKeyBuff = Buffer.from(privateKey.replace('0x', ''), "hex");
  let signature = eutil.ecsign(dataToSigBuff, privateKeyBuff);
  return '0x' + signature.r.toString('hex') + signature.s.toString('hex') + '0' + (signature.v - 27).toString(16);
}

export function getWalletBalancesThunk(walletId) {
  return async (dispatch, getState) => {
    let supportedCoins = getDefaultSupportedTokens();
    supportedCoins.shift();
    dispatch(countUpRequests());
    let result = {walletId: walletId};
    try {
      for (var i = 0; i < supportedCoins.length; i++) {
        result[supportedCoins[i].tokenName] = await multisigContractReal.methods.getDepositedBalance(walletId, supportedCoins[i].extTokenId).call();
      }
      dispatch(onChangeDetailWallet(result));
    } catch (e) {
      console.log('error occured while get wallet balances api: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  }
}

export function getWithdrawRequestByAddressAndWalletId(row) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
    try {
      const requestRes = await getRequestStatus(generatedETHAcc, row);
      if (isEmpty(requestRes)) {
        return;
      }
      dispatch(onChangeRow(row.walletId - 1, requestRes));

    } catch (e) {
      console.log('error occured while get withdraw request record: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  }
}

export function renewThunk(row) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    try {
      let formWithdrawStep2 = row.withdrawRequest;
      const options = await buildOptions('PUT', {
        ethAddressStr: formWithdrawStep2.ethAddressStr,
        walletId: formWithdrawStep2.walletId,
        requirement: formWithdrawStep2.requirement,
        tokenId: formWithdrawStep2.tokenId,
        amount: formWithdrawStep2.amount + '',
        randomBytes: formWithdrawStep2.randomBytes,
        dataToSign: formWithdrawStep2.dataToSign,
        status: REJECTED,
      });
      await makeCall(
        dispatch,
        updateWithdrawRequest(formWithdrawStep2.withdrawId),
        options,
      );
      dispatch(onChangeWithdrawStep(1));
      dispatch(onChangeRow(row.walletId - 1, null));
    } catch (e) {
      console.log('error occured while update withdraw request record: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  }
}

async function getRequestStatus(generatedETHAcc, row)
{
  const options = await buildOptions('GET');
  const requestRes = await makeCall(
    null,
    getPendingRequest(generatedETHAcc.address, row.walletId, PENDING),
    options,
  );
  let formWithdrawStep2 = {};
  let signatures = [];
  if (requestRes && requestRes.total > 0) {
    let request = requestRes.results[0];
    let ownersApproved = await makeCall(
      null,
      getApprovedRequest(request.withdrawId, APPROVED),
      options,
    );
    if (ownersApproved.total > 0) {
      for (var i = 0; i < ownersApproved.results.length && row.requirements > i; i++) {
        signatures.push(ownersApproved.results[i].signature);
      }
    }
    let ownersRejected = await makeCall(
      null,
      getApprovedRequest(request.withdrawId, REJECTED),
      options,
    );
    formWithdrawStep2 = request;
    formWithdrawStep2.receiverSignature = sigMess(request.dataToSign, generatedETHAcc.privateKey);
    formWithdrawStep2.rejected = ownersRejected.total;
    let isOwner = await multisigContractReal.methods.isOwnerOfWallet(row.walletId, generatedETHAcc.address).call();
    if (isOwner && row.requirements > signatures.length) {
      signatures.push(formWithdrawStep2.receiverSignature);
    }
    formWithdrawStep2.signatures = signatures;
    formWithdrawStep2.statusFromOwners = 0;
    if (formWithdrawStep2.signatures.length >= row.requirements) {
      formWithdrawStep2.statusFromOwners = 1;
    } else if (formWithdrawStep2.rejected > (row.owners.length - row.requirements)) {
      formWithdrawStep2.statusFromOwners = 2;
    }
  }
  return formWithdrawStep2;
}

function checkIfDuplicateExists(owners) {
  return new Set(owners).size !== owners.length
}

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}