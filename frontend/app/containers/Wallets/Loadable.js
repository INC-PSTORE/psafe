/**
 * Asynchronously loads the component for wallets Page
 */
import loadable from 'loadable-components';

export default loadable(() => import('./index'));
