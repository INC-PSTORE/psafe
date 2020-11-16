const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '90%',
    padding: 30,
  },
  tableStyle: {
    minWidth: "90%",
    minHeight: '80%',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 1.5,
  },
  tableInsideStyle: {
    minHeight: '100%',
    minWidth: "100%",
  },
  tableWrapper: {
    minHeight: '100%',
    overflowX: 'auto',
  },
  filterButtonGroup: {
    marginRight: 'auto',
  },
  filterButton: {
    margin: '10px',
  },
});

export default styles;
