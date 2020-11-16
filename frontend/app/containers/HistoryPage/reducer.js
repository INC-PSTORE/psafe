/*
 * History Page reducer
 */

import {
  // CHANGE_ROWS,
  // CHANGE_ALL_ROWS,
  CHANGE_PAGE,
  CHANGE_ROWS_PER_PAGE,
  CHANGE_ROWS_WITH_FILTER,
  CHANGE_HISTORY_FILTER,
} from './constants';
import {func} from "prop-types";

// The initial state of the ShieldingPage
export const initialState = {
  error: null,
  counter: 0,
  page: 0,
  rowsPerPage: 10,
  // rows: [],
  filter: '*',
  // allRows: [],
};

function historyReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ROWS_WITH_FILTER:
      return {
        ...state,
        rows: action.rows,
        filter: action.filterValue,
      }
    // case CHANGE_ROWS:
    //   return {
    //     ...state,
    //     rows: action.rows,
    //   }
    // case CHANGE_ALL_ROWS:
    //   return {
    //     ...state,
    //     allRows: action.allRows,
    //   }
    case CHANGE_PAGE:
      return {
        ...state,
        page: action.page,
      }
    case CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.rowsPerPage,
        page: action.page,
      }
    case CHANGE_HISTORY_FILTER:
      return {
        ...state,
        filter: action.filterValue,
      }
    default:
      return state;
  }
}

export default historyReducer;