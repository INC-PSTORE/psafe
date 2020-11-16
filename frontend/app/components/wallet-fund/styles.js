
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000 !important',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2.5,
    width: '80%',
    padding: 50,
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 170,
    justifyContent: 'center',
  },
  '@media (max-width: 600px)': {
    root: {
      width: '90%',
    },
    form: {
      width: '100%',
    },
    title: {
      marginTop: '-5%',
    },
  },

  form: {
    width: '70%',
  },
  button: {
    margin: 20,
  },
  // title: {
  //   marginTop: '-15%',
  // },
  
  fundButton: {
    margin: '10px',
  },
  actionsButtons: {
    textAlign: 'center',
    marginTop: 20,
  },
  actionsButton: {
    margin: 5,
  },
});

export default styles;