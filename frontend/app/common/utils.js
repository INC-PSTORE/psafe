
import {
  INCOGNITO_TESTNET_CONTRACT_ADDRESS,
  INCOGNITO_MAINNET_CONTRACT_ADDRESS,
  INCOGNITO_TESTNET_BURN_ADDRESS,
  INCOGNITO_MAINNET_BURN_ADDRESS,
  TOKEN_INFO,
  INCOGNITO_MAINNET_FULLNODE,
  INCOGNITO_TESTNET_FULLNODE,
  MULTISIG_TESTNET_CONTRACT_ADDRESS,
  MULTISIG_MAINNET_CONTRACT_ADDRESS,
  INFURA_TESTNET_WSS,
  INFURA_MAINNET_WSS,
  MULTISIG_ADAPTER_TESTNET_CONTRACT_ADDRESS,
  MULTISIG_ADAPTER_MAINNET_CONTRACT_ADDRESS,
} from './constants';

import Web3 from 'web3';
import Wallet from 'ethereumjs-wallet';
import {func} from "prop-types";
const secp256k1 = require('secp256k1');
const bs58 = require('bs58');

function isTestnet() {
  return process.env.NODE_ENV !== 'production';
}

function getIncognitoContractAddr() {
  if (isTestnet()) {
    return INCOGNITO_TESTNET_CONTRACT_ADDRESS;
  }
  return INCOGNITO_MAINNET_CONTRACT_ADDRESS;
}

function getMultisigContractAddr() {
  if (isTestnet()) {
    return MULTISIG_TESTNET_CONTRACT_ADDRESS;
  }
  return MULTISIG_MAINNET_CONTRACT_ADDRESS;
}

function getMultisigAdapterContractAddr() {
  if (isTestnet()) {
    return MULTISIG_ADAPTER_TESTNET_CONTRACT_ADDRESS;
  }
  return MULTISIG_ADAPTER_MAINNET_CONTRACT_ADDRESS;
}

function getIncognitoToBurnCoin() {
  if (isTestnet()) {
    return INCOGNITO_TESTNET_BURN_ADDRESS;
  }
  return INCOGNITO_MAINNET_BURN_ADDRESS;
}

function getIncognitoFullnode() {
  if (isTestnet()) {
    return INCOGNITO_TESTNET_FULLNODE;
  }
  return INCOGNITO_MAINNET_FULLNODE;
}

function getINFURAWSS() {
  if (isTestnet()) {
    return INFURA_TESTNET_WSS;
  }
  return INFURA_MAINNET_WSS;
}

function getETHFullnodeHost() {
  if (isTestnet()) {
    return 'https://kovan.infura.io/v3/34918000975d4374a056ed78fe21c517';
  }
  return 'https://kovan.infura.io/v3/34918000975d4374a056ed78fe21c517';
}

function getEtherScanAPIHost() {
  if (isTestnet()) {
    //todo: need to change to etherscan kovan
    return 'https:///api.etherscan.io/api';
  }
  return 'https:///api.etherscan.io/api';
}

function getIncContractABI() {
  return [{ "inputs": [{ "internalType": "address", "name": "admin", "type": "address" }, { "internalType": "address", "name": "incognitoProxyAddress", "type": "address" }, { "internalType": "address", "name": "_prevVault", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "claimer", "type": "address" }], "name": "Claim", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "token", "type": "address" }, { "indexed": false, "internalType": "string", "name": "incognitoAddress", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "ndays", "type": "uint256" }], "name": "Extend", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "returnedTokenAddress", "type": "address" }], "name": "LogVerifier1", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "returnedAmount", "type": "uint256" }], "name": "LogVerifier2", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "newVault", "type": "address" }], "name": "Migrate", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address[]", "name": "assets", "type": "address[]" }], "name": "MoveAssets", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "pauser", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "pauser", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "newIncognitoProxy", "type": "address" }], "name": "UpdateIncognitoProxy", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address[]", "name": "assets", "type": "address[]" }, { "indexed": false, "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "UpdateTokenTotal", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "constant": true, "inputs": [], "name": "ETH_TOKEN", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "claim", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "expire", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "n", "type": "uint256" }], "name": "extend", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "incognito", "outputs": [{ "internalType": "contract Incognito", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "newVault", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "prevVault", "outputs": [{ "internalType": "contract Withdrawable", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_successor", "type": "address" }], "name": "retire", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "sigDataUsed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "successor", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalDepositedToSCAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "withdrawRequests", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "withdrawed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "string", "name": "incognitoAddress", "type": "string" }], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "string", "name": "incognitoAddress", "type": "string" }], "name": "depositERC20", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }], "name": "isWithdrawed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes", "name": "inst", "type": "bytes" }], "name": "parseBurnInst", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address payable", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes", "name": "inst", "type": "bytes" }, { "internalType": "uint256[2]", "name": "heights", "type": "uint256[2]" }, { "internalType": "bytes32[][2]", "name": "instPaths", "type": "bytes32[][2]" }, { "internalType": "bool[][2]", "name": "instPathIsLefts", "type": "bool[][2]" }, { "internalType": "bytes32[2]", "name": "instRoots", "type": "bytes32[2]" }, { "internalType": "bytes32[2]", "name": "blkData", "type": "bytes32[2]" }, { "internalType": "uint256[][2]", "name": "sigIdxs", "type": "uint256[][2]" }, { "internalType": "uint8[][2]", "name": "sigVs", "type": "uint8[][2]" }, { "internalType": "bytes32[][2]", "name": "sigRs", "type": "bytes32[][2]" }, { "internalType": "bytes32[][2]", "name": "sigSs", "type": "bytes32[][2]" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes", "name": "inst", "type": "bytes" }, { "internalType": "uint256[2]", "name": "heights", "type": "uint256[2]" }, { "internalType": "bytes32[][2]", "name": "instPaths", "type": "bytes32[][2]" }, { "internalType": "bool[][2]", "name": "instPathIsLefts", "type": "bool[][2]" }, { "internalType": "bytes32[2]", "name": "instRoots", "type": "bytes32[2]" }, { "internalType": "bytes32[2]", "name": "blkData", "type": "bytes32[2]" }, { "internalType": "uint256[][2]", "name": "sigIdxs", "type": "uint256[][2]" }, { "internalType": "uint8[][2]", "name": "sigVs", "type": "uint8[][2]" }, { "internalType": "bytes32[][2]", "name": "sigRs", "type": "bytes32[][2]" }, { "internalType": "bytes32[][2]", "name": "sigSs", "type": "bytes32[][2]" }], "name": "submitBurnProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes", "name": "signData", "type": "bytes" }, { "internalType": "bytes32", "name": "hash", "type": "bytes32" }], "name": "sigToAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }], "name": "isSigDataUsed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "string", "name": "incognitoAddress", "type": "string" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "signData", "type": "bytes" }, { "internalType": "bytes", "name": "timestamp", "type": "bytes" }], "name": "requestWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "recipientToken", "type": "address" }, { "internalType": "address", "name": "exchangeAddress", "type": "address" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "bytes", "name": "timestamp", "type": "bytes" }, { "internalType": "bytes", "name": "signData", "type": "bytes" }], "name": "execute", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address[]", "name": "tokens", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address[]", "name": "recipientTokens", "type": "address[]" }, { "internalType": "address", "name": "exchangeAddress", "type": "address" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "bytes", "name": "timestamp", "type": "bytes" }, { "internalType": "bytes", "name": "signData", "type": "bytes" }], "name": "executeMulti", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "getDepositedBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address payable", "name": "_newVault", "type": "address" }], "name": "migrate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address[]", "name": "assets", "type": "address[]" }], "name": "moveAssets", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address[]", "name": "assets", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "updateAssets", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "newIncognitoProxy", "type": "address" }], "name": "updateIncognitoProxy", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "getDecimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }];
}

function getMultisigAdapterContractABI () {
  return [{"inputs":[{"internalType":"contract multisig","name":"multisigContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH_CONTRACT_ADDRESS","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"k","type":"uint256"},{"internalType":"address[]","name":"pubkeys","type":"address[]"}],"name":"initMultiSigAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"multisigIns","outputs":[{"internalType":"contract multisig","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"multisigId","type":"uint256"},{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendERC20Fund","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multisigId","type":"uint256"}],"name":"sendEtherFund","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multisigId","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"},{"internalType":"bytes","name":"receiverSig","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawFund","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
}

function getMultisigContractABI(){
  return [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"walletId","type":"uint256"}],"name":"Fund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"owners","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"requirements","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"walletId","type":"uint256"}],"name":"NewWallet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"walletId","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ETH_CONTRACT_ADDRESS","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SIGNATURE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"walletId","type":"uint256"},{"internalType":"address","name":"token","type":"address"}],"name":"getDepositedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"k","type":"uint256"},{"internalType":"address[]","name":"pubkeys","type":"address[]"}],"name":"initMultiSigAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"walletId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"isOwnerOfWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"isSigDataUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"multisigAddresses","outputs":[{"internalType":"uint256","name":"k","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"multisigId","type":"uint256"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendERC20Fund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multisigId","type":"uint256"}],"name":"sendEtherFund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"sigDataUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"signData","type":"bytes"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"sigToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"totalMultisigWallet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"multisigId","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"},{"internalType":"bytes","name":"receiverSig","type":"bytes"},{"internalType":"bytes","name":"timestamp","type":"bytes"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address payable","name":"delegator","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawFund","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}];
}

function getERC20ContractABI() {
  return [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ];
}

function getTokenById(tokenId) {
  let listToken;
  if (isTestnet()) {
    listToken = {
      "0x0000000000000000000000000000000000000000": {
        incTokenId: 'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854',
        tokenName: 'Ether',
        eDecimals: 18,
        pDecimals: 9,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/eth@2x.png',
      },
      "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa": {
        incTokenId: 'c7545459764224a000a9b323850648acf271186238210ce474b505cd17cc93a0',
        tokenName: 'DAI',
        eDecimals: 18,
        pDecimals: 9,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/dai@2x.png',
      },
      // {
      //   incTokenId: '497159cf6c9f8d5a7cffd38d392649fee7b61558689ba631b26ef1b2dd8c9a06',
      //   extTokenId: '0xf3e0d7bf58c5d455d31ef1c2d5375904df525105',
      //   tokenName: 'USDT',
      //   eDecimals: 18,
      //   pDecimals: 6,
      // },
      "0x75b0622cec14130172eae9cf166b92e5c112faff": {
        incTokenId: '61e1efbf6be9decc46fdf8250cdae5be12bee501b65f774a58af4513b645f6a3',
        tokenName: 'USDC',
        eDecimals: 6,
        pDecimals: 6,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/usdc@2x.png',
      },
    }
  } else {
    listToken = {
    "0x0000000000000000000000000000000000000000": {
      incTokenId: 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f',
      tokenName: 'Ether',
      eDecimals: 0,
      pDecimals: 9,
    },
    "0xc4375b7de8af5a38a93548eb8453a498222c4ff2": {
      incTokenId: '3f89c75324b46f13c7b036871060e641d996a24c09b3065835cb1d38b799d6c1',
      tokenName: 'DAI',
      eDecimals: 18,
      pDecimals: 9,
    },
    "0xf3e0d7bf58c5d455d31ef1c2d5375904df525105": {
      incTokenId: '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
      tokenName: 'USDT',
      eDecimals: 18,
      pDecimals: 6,
    },
    // {
    //   incTokenId: '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
    //     extTokenId: '',
    //   tokenName: 'USDC',
    //   eDecimals: 6,
    //   pDecimals: 6,
    // }
    }
  }
  return listToken[tokenId];
}

function getDefaultSupportedTokens() {
  if (isTestnet()) {
    return [
      {
        incTokenId: TOKEN_INFO.PRV.tokenId,
        extTokenId: null,
        tokenName: TOKEN_INFO.PRV.name,
        eDecimals: 0,
        pDecimals: 9,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/prv@2x.png',
      },
      {
        incTokenId: 'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854',
        extTokenId: '0x0000000000000000000000000000000000000000',
        tokenName: 'Ether',
        eDecimals: 18,
        pDecimals: 9,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/eth@2x.png',
      },
      {
        incTokenId: 'c7545459764224a000a9b323850648acf271186238210ce474b505cd17cc93a0',
        extTokenId: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
        tokenName: 'DAI',
        eDecimals: 18,
        pDecimals: 9,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/dai@2x.png',
      },
      // {
      //   incTokenId: '497159cf6c9f8d5a7cffd38d392649fee7b61558689ba631b26ef1b2dd8c9a06',
      //   extTokenId: '0xf3e0d7bf58c5d455d31ef1c2d5375904df525105',
      //   tokenName: 'USDT',
      //   eDecimals: 18,
      //   pDecimals: 6,
      // },
      {
        incTokenId: '61e1efbf6be9decc46fdf8250cdae5be12bee501b65f774a58af4513b645f6a3',
        extTokenId: '0x75b0622cec14130172eae9cf166b92e5c112faff',
        tokenName: 'USDC',
        eDecimals: 6,
        pDecimals: 6,
        icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/usdc@2x.png',
      },
    ];
  }
  return [
    {
      incTokenId: TOKEN_INFO.PRV.tokenId,
      extTokenId: null,
      tokenName: TOKEN_INFO.PRV.name,
      eDecimals: 0,
      pDecimals: 9,
    },
    {
      incTokenId: 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f',
      extTokenId: '0x0000000000000000000000000000000000000000',
      tokenName: 'Ether',
      eDecimals: 0,
      pDecimals: 9,
    },
    {
      incTokenId: '3f89c75324b46f13c7b036871060e641d996a24c09b3065835cb1d38b799d6c1',
      extTokenId: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
      tokenName: 'DAI',
      eDecimals: 18,
      pDecimals: 9,
    },
    {
      incTokenId: '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
      extTokenId: '0xf3e0d7bf58c5d455d31ef1c2d5375904df525105',
      tokenName: 'USDT',
      eDecimals: 18,
      pDecimals: 6,
    },
    {
      incTokenId: '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
      extTokenId: '',
      tokenName: 'USDC',
      eDecimals: 6,
      pDecimals: 6,
    },
  ];
}

function getDefaultSupportedPTokens() {
  if (isTestnet()) {
    return [
      {
        tokenName: 'PETH',
      },
      {
        tokenName: 'PDAI',
      },
      {
        tokenName: 'PUSDT',
      },
    ];
  }
  return [
    {
      tokenName: 'PETH',
    },
    {
      tokenName: 'PDAI',
    },
    {
      tokenName: 'PUSDT',
    },
  ];
}

// generated eth from incKey success
function genETHAccFromIncPrivKey(incPrivKey) {
  const web3 = new Web3();
  let bytes = bs58.decode(incPrivKey);
  bytes = bytes.slice(1, bytes.length - 4);
  const privHexStr = web3.utils.bytesToHex(bytes);
  let privKey = web3.utils.keccak256(privHexStr);
  let temp, temp2;
  temp = web3.utils.hexToBytes(privKey);
  temp2 = new Uint8Array(temp);
  secp256k1.privateKeyVerify(temp2);
  while (!secp256k1.privateKeyVerify(temp2)) {
    console.log('come here');
    privKey = web3.utils.keccak256(privKey);
    console.log({ privKey });
    temp = web3.utils.hexToBytes(privKey);
    temp2 = new Uint8Array(temp);
  }
  const fixturePrivateBuffer = Buffer.from(privKey.replace('0x', ''), 'hex');
  return Wallet.fromPrivateKey(fixturePrivateBuffer);
}

export {
  isTestnet,
  getIncognitoFullnode,
  getIncognitoContractAddr,
  getETHFullnodeHost,
  getIncContractABI,
  getERC20ContractABI,
  getDefaultSupportedTokens,
  getIncognitoToBurnCoin,
  getDefaultSupportedPTokens,
  getEtherScanAPIHost,
  getMultisigContractAddr,
  getMultisigContractABI,
  getINFURAWSS,
  getMultisigAdapterContractAddr,
  getMultisigAdapterContractABI,
  genETHAccFromIncPrivKey,
  getTokenById,
};