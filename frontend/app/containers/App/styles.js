import {blue, grey, orange} from "@material-ui/core/colors";
import { PRIMARY_COLOR } from '../../common/constants';

const styles = {
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    textDecoration: 'none',
    color: grey[500],
  },
  activeLink: {
    color: 'white',
    textDecoration: 'none',
  },
  homeLogo: {
    color: '#fff',
    backgroundColor: PRIMARY_COLOR,
  },
  homeLink: {
    height: 26,
    color: '#fff',
    textDecoration: 'none',
  },
  homeIcon: {
    verticalAlign: 'unset',
  },
  accountLogo: {
    marginRight: 16,
    color: '#fff',
  },
  accountInfo: {
    zIndex: 9999,
    width: 300,
  },
  coinName: {
    paddingTop: 7,
  },
  icon: {
    width: 20,
    height: 22,
    margin: '5px 10px 5px 0px',
  },
  coinInfo: {
    display: 'flex',
  },
  pstoreButton: {
    textTransform: 'none',
    backgroundColor: grey[50],
  },
  pstoreButtonWrapper: {
    textAlign: 'center',
    marginTop: 6,
  },
  accountAddressSection: {
    display: 'flex',
    paddingLeft: 15,
  },
  accountAddress: {
    margin: '5px 5px 5px 6px',
    overflowWrap: 'anywhere',
  },
  accountAddrIcon: {
    marginTop: 10,
  },
  metaMaskMess: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#f44336",
    color: 'white',
  },
};

export default styles;
