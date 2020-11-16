/*
 * History Page actions
 */

import {
  CHANGE_PAGE,
  CHANGE_ROWS_PER_PAGE,
  CHANGE_HISTORY_FILTER,
} from './constants';

export function onChangePage(page) {
  return {
    type: CHANGE_PAGE,
    page,
  }
}

export function onChangeRowsPerPage(page, rowsPerPage) {
  return {
    type: CHANGE_ROWS_PER_PAGE,
    rowsPerPage,
    page,
  }
}

export function onChangeFilter(filterValue) {
  return {
    type: CHANGE_HISTORY_FILTER,
    filterValue,
  }
}