const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100%',
    padding: 30,
    width: '100%',
  },
  paper: {
    width: "75%",
    // minWidth: "100%",
    // minHeight: '80%',
    // color: theme.palette.text.secondary,
    // marginLeft: theme.spacing.unit * 1.5,
  },
  tableInsideStyle: {
    // minHeight: '100%',
    // minWidth: "100%",
    // overflowWrap: 'anywhere',
  },
  tableWrapper: {
    // minHeight: '100%',
    overflowX: 'auto',
  },
  snackBar: {
    marginTop: "3%",
  },
  snackBarContent: {
    backgroundColor: "#f44336",
    color: "white",
  },
  snackBarContentSuccess: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  paperWalletRow: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000 !important',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2.5,
    width: '80%',
    // minHeight: '60%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  '@media (max-width: 900px)': {
    root: {
      width: '100%',
      padding: 30,
    },
    paper: {
      width: "95%",
    },
    paperWalletRow: {
      width: '100%',
      minHeight: '100%',
    },
  },
});

export default styles;
