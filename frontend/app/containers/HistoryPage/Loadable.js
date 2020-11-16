/**
 * Asynchronously loads the component for history
 */
import loadable from 'loadable-components';

export default loadable(() => import('./index'));
