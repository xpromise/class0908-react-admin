/*
  引入外面要使用actions和reducer
  统一暴露出去
*/

import roleReducer from './reducer';
import { getRoleListAsync, addRoleAsync, updateRoleAsync } from './actions';

export { roleReducer, getRoleListAsync, addRoleAsync, updateRoleAsync };
