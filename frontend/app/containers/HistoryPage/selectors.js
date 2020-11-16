/**
 * History Page selectors
 */

import { createSelector } from 'reselect';

const selectHistory = state => state.history; // 'sign' here should match to registered reducer name in index.js

const makeSelectPage = () =>
  createSelector(
    selectHistory,
    historyState => historyState.page,
  )

const makeSelectRowsPerPage = () =>
  createSelector(
    selectHistory,
    historyState => historyState.rowsPerPage,
  )

const makeSelectFilter = () =>
  createSelector(
    selectHistory,
    historyState => historyState.filter,
  )

export {
  makeSelectPage,
  makeSelectRowsPerPage,
  makeSelectFilter,
};

