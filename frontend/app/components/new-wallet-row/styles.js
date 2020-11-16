
const styles = theme => ({
  inlineButton: {
    textTransform: 'none',
    fontWeight: 400,
  },
  row: {
    height: 'auto',
  },
  walletDetailRow: {
    overflowWrap: 'anywhere',
  },
  cell: {
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 0,
  },
  walletAddrCell: {
    display: 'flex',
    paddingLeft: 20,
    alignItems: 'center',
  },
  walletAddr: {
    marginTop: 1,
  },
  actionButtons: {
    margin: '8px 0px 8px 0px',
  },
});

export default styles;