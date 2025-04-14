import { welcome } from 'controllers/user.js';

export default [{ method: 'GET', path: '/items', handler: welcome }];
