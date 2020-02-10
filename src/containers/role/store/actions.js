import {
  reqGetRoleList,
  reqAddRole,
  reqUpdateRole
} from '$api';

import {
  GET_ROLE_LIST,
  ADD_ROLE,
  UPDATE_ROLE
} from './action-types';

// 同步action
const getRoleList = roles => ({ type: GET_ROLE_LIST, data: roles });

// 异步action
export const getRoleListAsync = () => {
  return dispatch => {
    // 执行异步操作
    return reqGetRoleList().then(res => {
      // 请求成功，更新redux状态
      dispatch(getRoleList(res));
    });
  };
};


// 同步action
const addRole = role => ({ type: ADD_ROLE, data: role });

// 异步action
export const addRoleAsync = (name) => {
  return dispatch => {
    // 执行异步操作
    return reqAddRole(name).then(res => {
      // 请求成功，更新redux状态
      dispatch(addRole(res));
    });
  };
};

// 同步action
const updateRole = role => ({ type: UPDATE_ROLE, data: role });

// 异步action
export const updateRoleAsync = (name) => {
  return dispatch => {
    // 执行异步操作
    return reqUpdateRole(name).then(res => {
      // 请求成功，更新redux状态
      dispatch(updateRole(res));

      // 将请求更新后的role返回出去
      return res;
    });
  };
};
