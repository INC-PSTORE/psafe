/**
 * Sign Page selectors
 */

import { createSelector } from 'reselect';

const selectSign = state => state.sign; // 'sign' here should match to registered reducer name in index.js

const makeSelectSignature = () =>
  createSelector(
    selectSign,
    signState => signState.signature,
  );

const makeSelectDataToSign = () =>
  createSelector(
    selectSign,
    signState => signState.dataToSign,
  );

const makeSelectValidateForm = () =>
  createSelector(
    selectSign,
    signState => signState.validateForm,
  );

const makeSelectRows = () =>
  createSelector(
    selectSign,
    signState => signState.rows,
  );

const makeSelectSelectedRow = () =>
  createSelector(
    selectSign,
    signState => signState.selectedRow,
  );

export {
  makeSelectSignature,
  makeSelectDataToSign,
  makeSelectValidateForm,
  makeSelectRows,
  makeSelectSelectedRow,
};

