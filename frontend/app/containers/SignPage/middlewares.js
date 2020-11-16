/*
* App middlewares
*/

import Web3 from 'web3';

import { countUpRequests, countDownRequests } from '../App/actions';
import {
  updateValidateForm,
  updateRows,
  updateSelectedRow,
} from "./actions";
import {buildOptions, makeCall} from "../../utils/api-call";
import {getRequests, updateRequestByOwner} from "../../utils/api-routes";
import {APPROVED, PENDING, REJECTED} from "../../common/constants";
import {sigMess} from "../Wallets/middlewares";
let filterRequest = "*";

export function approveActionThunk(selectedRow, type) {
  return async (dispatch, getState) => {
    dispatch(countUpRequests());
    let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
    let rows = getState().sign.rows;
    let selectedRowDetail = getState().sign.selectedRow;
    try {
      let options;
      switch (type) {
        case APPROVED:
          options = await buildOptions('PUT', {
            ethAddressStr: generatedETHAcc.address.toLowerCase(),
            requestId: selectedRow.withdrawId,
            approve: APPROVED,
            signature: sigMess(selectedRow.dataToSign, generatedETHAcc.privateKey),
          });
          break;
        case REJECTED:
          options = await buildOptions('PUT', {
            ethAddressStr: generatedETHAcc.address.toLowerCase(),
            requestId: selectedRow.withdrawId,
            approve: REJECTED,
            signature: "",
          });
          break;
      }
      await makeCall(
        dispatch,
        updateRequestByOwner(),
        options,
      );
      filterRequest = selectedRow.withdrawId;
      rows = rows.filter(removeRequest);
      dispatch(updateRows(rows));
      if (selectedRowDetail && selectedRowDetail.withdrawId === selectedRow.withdrawId) {
        dispatch(updateSelectedRow(null));
      }
      dispatch(updateValidateForm({snackBar: {isSuccess: true, message: (type === APPROVED ? "Approved" : "Rejected") + " successfully!"}}));
    } catch (e) {
      console.log('error occured while processing request: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
    dispatch(countDownRequests());
  };
}

export function getRequestsThunk() {
  return async (dispatch, getState) => {
    let generatedETHAcc = getState().app.generatedETHAccFromIncAcc;
    try {
      const options = await buildOptions('GET');
      const requestRes = await makeCall(
        dispatch,
        getRequests(generatedETHAcc.address, PENDING),
        options,
      );
      if (requestRes.total !== 0) {
        const rows = requestRes.results;
        dispatch(updateRows(rows));
      }
    } catch (e) {
      console.log('error occured while get request records: ', e);
      dispatch(updateValidateForm({snackBar: {isError: true, message: "Something went wrong!"}}));
    }
  }
}

function removeRequest(element) {
  return (element.withdrawId !== filterRequest || filterRequest === '*');
}