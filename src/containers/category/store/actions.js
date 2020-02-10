import {
  reqGetCategoryList,
  reqAddCategory,
  reqUpdateCategory,
  reqDeleteCategory
} from '$api';
import {
  GET_CATEGORY_LIST,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} from './action-types';

// 同步action
const getCategoryList = categories => ({
  type: GET_CATEGORY_LIST,
  data: categories
});
// 异步action
export const getCategoryListAsync = () => {
  return dispatch => {
    // 发送请求
    // 不加return，getCategoryListAsync方法就没有返回值
    // 加上return，getCategoryListAsync方法就是return的返回值
    // 请求成功，最终返回值是成功的promise
    // 请求失败，最终返回值是失败的promise
    return reqGetCategoryList().then(response => {
      // 调用dispatch，触发更新
      dispatch(getCategoryList(response));
    });
  };
};

const addCategory = category => ({
  type: ADD_CATEGORY,
  data: category
});

export const addCategoryAsync = categoryName => {
  return dispatch => {
    // 发送请求
    return reqAddCategory(categoryName).then(response => {
      // 调用dispatch，触发更新
      dispatch(addCategory(response));
    });
  };
};

const updateCategory = category => ({
  type: UPDATE_CATEGORY,
  data: category
});

export const updateCategoryAsync = (categoryId, categoryName) => {
  return dispatch => {
    // 发送请求
    return reqUpdateCategory(categoryId, categoryName).then(response => {
      // 调用dispatch，触发更新
      dispatch(updateCategory(response));
    });
  };
};

const deleteCategory = id => ({
  type: DELETE_CATEGORY,
  data: id
});

export const deleteCategoryAsync = categoryId => {
  return dispatch => {
    // 发送请求
    return reqDeleteCategory(categoryId).then(response => {
      // 调用dispatch，触发更新
      dispatch(deleteCategory(response));
    });
  };
};
