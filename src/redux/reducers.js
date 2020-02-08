/**
 * 用来根据prevState和action生成newState函数模块
 */
import { combineReducers } from 'redux';
import {
  SAVE_USER,
  REMOVE_USER,
  CHANGE_LANGUAGE,
  GET_CATEGORY_LIST,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ROLE_LIST,
  ADD_ROLE,
  UPDATE_ROLE
} from './action-types';
import { getItem } from '../utils/storage';

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

// 不能修改原数据，store是只读的
const initCategories = [];
function categories(prevState = initCategories, action) {
  switch (action.type) {
    case GET_CATEGORY_LIST:
      return action.data;
    case ADD_CATEGORY:
      return [...prevState, action.data];
    case UPDATE_CATEGORY:
      return prevState.map(category => {
        if (category._id === action.data._id) {
          return action.data;
        }
        return category;
      });
    case DELETE_CATEGORY:
      return prevState.filter(category => category._id !== action.data);
    default:
      return prevState;
  }
}

// 如果是新状态数据，就得创建一个新的reducer函数
// 默认值，如果是[],就初始化空数组，如果是{}，就初始化空对象。。。
const initRoles = [];
function roles(prevState = initRoles, action) {
  switch (action.type) {
    case GET_ROLE_LIST:
      return action.data;
    case ADD_ROLE:
      return [...prevState, action.data];
    case UPDATE_ROLE:
      return prevState.map(role => {
        if (role._id === action.data._id) {
          return action.data;
        }
        return role;
      });
    default:
      return prevState;
  }
}

// 将多个reducer函数整合成一个返回
export default combineReducers({
  user,
  language,
  categories,
  roles
});
