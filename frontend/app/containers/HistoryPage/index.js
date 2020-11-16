/*
* History Page
*/

import React from 'react';
import {
  onChangeRowsPerPage,
  onChangePage,
  onChangeFilter,
} from "./actions";
import {createStructuredSelector} from "reselect";
import {
  makeSelectEventFundWithdraw,
} from '../Wallets/selectors';
import {
  makeSelectPage,
  makeSelectRowsPerPage,
  makeSelectFilter,
} from "./selectors";
import {connect} from "react-redux";
import reducer from "./reducer";
import {withStyles} from "@material-ui/core/styles";
import styles from "./styles";
import withWidth from "@material-ui/core/withWidth";
import {compose} from "redux";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from '@material-ui/core/TableHead';
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "../../components/table-pagination";
import Button from "@material-ui/core/Button";
import injectReducer from 'utils/injectReducer';

/* eslint-disable react/prefer-stateless-function */
export class HistoryPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.allFilter = this.allFilter.bind(this);
    this.withdrawFilter = this.withdrawFilter.bind(this);
    this.depositFilter = this.depositFilter.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.countFilter = this.countFilter.bind(this);
  }

  allFilter() {
    this.handleUpdate('*');
  }

  withdrawFilter() {
    this.handleUpdate('withdraw');
  }

  depositFilter() {
    this.handleUpdate('fund');
  }

  countFilter(row) {
    const {filter} = this.props;
    return (filter === '*' || row.type === filter);
  }

  handleUpdate(filterValue) {
    const {onUpdateFilter} = this.props;
    onUpdateFilter(filterValue);
  }

  handleChangePage = (event, page) => {
    const {onUpdatePage} = this.props;
    onUpdatePage(page);
  };

  handleChangeRowsPerPage = event => {
    const {onUpdateRowsPerPage} = this.props;
    onUpdateRowsPerPage(0, Number(event.target.value));
  };

  componentDidMount() {
    const {rows, history} = this.props;
    if (!rows) {
      history.push('/');
    }
  }

  render() {
    const {classes, rows, rowsPerPage, page, filter} = this.props;
    console.log({rows});
    const emptyRows = rows ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) : 0;
    const rowsAfterFilter = rows ? rows.filter(this.countFilter) : [];

    return (
      <div className={classes.root}>
        <div className={classes.filterButtonGroup}>
          <Button className={classes.filterButton} onClick={this.allFilter}
                  variant={filter === '*' ? 'outlined' : 'contained'} color="inherit">
            All
          </Button>
          <Button className={classes.filterButton} onClick={this.depositFilter}
                  variant={filter === 'fund' ? 'outlined' : 'contained'} color="inherit">
            Fund
          </Button>
          <Button className={classes.filterButton} onClick={this.withdrawFilter}
                  variant={filter === 'withdraw' ? 'outlined' : 'contained'} color="inherit">
            Withdraw
          </Button>
        </div>
        <Paper className={classes.tableStyle}>
          <div className={classes.tableWrapper}>
            {rows && rows.length === 0
              ?
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h1> No History Exist Yet! </h1>
              </div>
              :
              <Table className={classes.tableInsideStyle}>
                <TableHead>
                  <TableRow>
                    <TableCell>Wallet ID</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="center">Token ID</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Receiver</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows &&
                  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                      if (row.type === filter || filter === '*') {
                        return (
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {row.walletId}
                            </TableCell>
                            <TableCell align="center">
                              {row.type}
                            </TableCell>
                            <TableCell align="center">
                              {row.token}
                            </TableCell>
                            <TableCell align="center">
                              {row.amount}
                            </TableCell>
                            <TableCell align="center">
                              {row.type === 'withdraw' ? row.receiver : ''}
                            </TableCell>
                          </TableRow>
                        )
                      }
                    }
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{height: 48 * emptyRows}}>
                      <TableCell colSpan={6}/>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={rowsAfterFilter.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        native: true,
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            }
          </div>
        </Paper>
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onUpdatePage: (page) => dispatch(onChangePage(page)),
    onUpdateRowsPerPage: (page, rowsPerPage) => dispatch(onChangeRowsPerPage(page, rowsPerPage)),
    onUpdateFilter: (filterValue) => dispatch(onChangeFilter(filterValue)),
  }
}

const mapStateToProps = createStructuredSelector({
  rows: makeSelectEventFundWithdraw(),
  page: makeSelectPage(),
  rowsPerPage: makeSelectRowsPerPage(),
  filter: makeSelectFilter(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({key: 'history', reducer});

const withStylesHistoryPage = withStyles(styles);
const withWidthHistoryPage = withWidth();

export default compose(
  withReducer,
  withConnect,
  withStylesHistoryPage,
  withWidthHistoryPage,
)(HistoryPage);