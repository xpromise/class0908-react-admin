/**
 * 用来根据prevState和action生成newState函数模块
 */
import { combineReducers } from 'redux';
import { SAVE_USER, REMOVE_USER, CHANGE_LANGUAGE } from './action-types';
import { getItem } from '../utils/storage';

import { roleReducer } from '$cont/role/store';
import { categoryReducer } from '$cont/category/store';

const initUser = getItem('user') || {};
function user(prevState = initUser, action) {
  switch (action.type) {
    case SAVE_USER:
      return action.data;
    case REMOVE_USER:
      return {};
    default:
      return prevState;
  }
}

const initLanguage = navigator.language || navigator.languages[0] || 'zh-CN';
function language(prevState = initLanguage, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return action.data;
    default:
      return prevState;
  }
}

// 将多个reducer函数整合成一个返回
export default combineReducers({
  user,
  language,
  categories: categoryReducer,
  roles: roleReducer
});
