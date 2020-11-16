import { orange } from "@material-ui/core/colors";

const styles = theme => ({
  newWallet: {
    width: '75%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2.5,
    width: '80%',
    // minHeight: '60%',
  },
  '@media (max-width: 600px)': {
    paper: {
      width: '100%',
      minHeight: '100%',
    }
  },
  newWalletButton: {
    textTransform: 'none',
    fontWeight: 400,
    marginBottom: '15px',
  },
  icon: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formStyle :{
    '& > *': {
      margin: theme.spacing.unit * 2,
      width: '80%',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsButtons: {
    textAlign: 'center',
    marginTop: 20,
  },
  actionsButton: {
    margin: 5,
  },
  ownerButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '10%',
  },
  ownerButton: {
    textTransform: 'none',
    padding: 3,
    // color: orange[500],
  },

  '@media (max-width: 650px)': {
    newWallet: {
      width: '95%',
    },
  },
});

export default styles;