/**
 * 封装请求功能函数
 */
import axiosInstance from './request';

// 请求登录
export const reqLogin = (username, password) => {
  return axiosInstance({
    url: '/login',
    method: 'POST',
    data: {
      username,
      password
    }
  });
};

// 请求获取分类数据
export const reqGetCategoryList = () => {
  return axiosInstance({
    url: '/category/get',
    method: 'GET'
  });
}

// 请求添加分类数据
export const reqAddCategory = (categoryName) => {
  return axiosInstance({
    url: '/category/add',
    method: 'POST',
    data: {
      categoryName
    }
  });
};

// 请求修改分类数据
export const reqUpdateCategory = (categoryId, categoryName) => {
  return axiosInstance({
    url: '/category/update',
    method: 'POST',
    data: {
      categoryId,
      categoryName
    }
  });
};