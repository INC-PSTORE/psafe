/*
* api routes
*/

import { buildApiServer } from './api-call';

export function createNewWithdrawRequest() {
  return `${buildApiServer()}/withdraw`;
}

export function getRequests(ethAddress, type) {
  return `${buildApiServer()}/withdraws/requests?eth_address_str=${ethAddress.toLowerCase()}&approve=${type}`;
}

export function updateRequestByOwner() {
  return `${buildApiServer()}/withdraw/owner`;
}

export function getPendingRequest(ethAddress, walletId, status) {
  return `${buildApiServer()}/withdraws?eth_address_str=${ethAddress.toLowerCase()}&status=${status}&wallet_id=${walletId}`;
}

export function getApprovedRequest(walletId, status) {
  return `${buildApiServer()}/withdraws/owners?request_id=${walletId}&approve=${status}`;
}

export function updateWithdrawRequest(withdrawId) {
  return `${buildApiServer()}/withdraw/update/${withdrawId}`;
}