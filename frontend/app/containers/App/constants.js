/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */


// export const PSTORE_DOMAIN = 'https://pstore.app'; // TODO: update to correct domain
export const PSTORE_DOMAIN = 'http://localhost:8000'; // TODO: update to correct domain
export const ETH_PRIVATE_KEY_FIELD_NAME = 'ETH_PRIVATE_KEY';
export const INC_WALLET_FIELD_NAME = 'INC_WALLET';

export const HANDLE_FAILURE_GLOBALLY = 'devbowl/App/HANDLE_FAILURE_GLOBALLY';

export const LOAD_KEY_FROM_STORAGE =
  'devbowl/App/LOAD_KEY_FROM_STORAGE';

export const CREATE_ETH_ACCOUNT =
  'devbowl/App/CREATE_ETH_ACCOUNT';

export const IMPORT_ETH_ACCOUNT =
  'devbowl/App/IMPORT_ETH_ACCOUNT';

export const CREATE_PRIVATE_INC_ACCOUNT =
  'devbowl/App/CREATE_PRIVATE_INC_ACCOUNT';

export const IMPORT_PRIVATE_INC_ACCOUNT =
  'devbowl/App/IMPORT_PRIVATE_INC_ACCOUNT';

export const CREATE_TEMP_INC_ACCOUNT =
  'devbowl/App/CREATE_TEMP_INC_ACCOUNT';

export const IMPORT_TEMP_INC_ACCOUNT =
  'devbowl/App/IMPORT_TEMP_INC_ACCOUNT';

export const UPDATE_ACCOUNT =
  'devbowl/App/UPDATE_ACCOUNT';


export const LOAD_ACCOUNTS_SUCCESS =
  'devbowl/App/LOAD_ACCOUNTS_SUCCESS';
export const LOAD_ACCOUNTS_FAILURE =
  'devbowl/App/LOAD_ACCOUNTS_FAILURE';

export const LOAD_DEPLOYED_TOKENS_SUCCESS =
  'devbowl/App/LOAD_DEPLOYED_TOKENS_SUCCESS';
export const LOAD_DEPLOYED_TOKENS_FAILURE =
  'devbowl/App/LOAD_DEPLOYED_TOKENS_FAILURE';

export const TOGGLE_INFO_DIALOG =
  'devbowl/App/TOGGLE_INFO_DIALOG';
export const TOGGLE_ACCOUNT_INFO =
  'devbowl/App/TOGGLE_ACCOUNT_INFO';
export const CLOSE_ACCOUNT_INFO =
  'devbowl/App/CLOSE_ACCOUNT_INFO';

export const COUNT_UP_REQUESTS =
  'devbowl/App/COUNT_UP_REQUESTS';
export const COUNT_DOWN_REQUESTS =
  'devbowl/App/COUNT_DOWN_REQUESTS';

export const PRIVATE_INC_ACC_NAME =
  'Private Incognito Account';
export const TEMP_INC_ACC_NAME =
  'Temp Incognito Account';
export const ETH_ACC_NAME =
  'ETH Account';
export const ENABLE_META_MASK_ACCOUNTS =
  'devbowl/App/ENABLE_META_MASK_ACCOUNTS';