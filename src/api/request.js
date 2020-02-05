/**
 * 封装axios的模块
 */

import axios from 'axios';
import { message } from 'antd';

import errCode from '../config/error-code';
import store from '$redux/store';
import { removeItem } from '$utils/storage'
import { removeUser } from '$redux/actions';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: '/api', // 公共的请求路径前缀
  timeout: 20000, // 请求超时时间
  headers: {
    // 公共请求头参数
  }
});

// 设置拦截器函数

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
  /*
    设置公共的参数
  */

  // 问题: 需要处理token
  const token = store.getState().user.token;

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  /*
    如果是POST请求。需要开发者检查请求头是：application/json  applicaion/x-www-form-urlencoded
    如果是 application/json ， 就不用处理（因为axios默认值就是这个）
    如果是 application/x-www-form-urlencoded，就需要对请求参数进行urlencoded转换
  */
  if (config.method === 'post') {
    config.data = Object.keys(config.data)
      .reduce((p, c) => {
        p += `&${c}=${config.data[c]}`;
        return p;
      }, '')
      .slice(1);
    config.headers['content-type'] = 'application/x-www-form-urlencoded';
  }

  return config;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  // 成功的响应 --> 2xx
  response => {
    /*
      成功返回成功的promise
      失败返回失败的promise
    */
    if (response.data.status === 0) {
      return response.data.data;
    } else {
      return Promise.reject(response.data.msg);
    }
  },
  // 失败的响应
  err => {
    /*
      根据不同的错误原因，提示不同错误
    */

    // 错误原因
    let errMsg = '';

    if (err.response) {
      // 接受到响应了，但是响应是失败的
      // 根据响应状态码判断错误类型
      const status = err.response.status;
      errMsg = errCode[status];

      if (status === 401) {
        // console.log(typeof status); // number
        // 说明token出问题：过期了
        // 目的:让用户重新登录
        // 清除本地和redux中的用户数据，登录检查就会跳转到login
        removeItem('user');
        // 触发redux更新
        store.dispatch(removeUser());
        // 错误提示
        message.error('登录过期，请重新登录~');
      }

    } else {
      // 没有接受到响应
      // 根据响应message(错误信息)来判断错误类型
      if (err.message.indexOf('Network Error') !== -1) {
        errMsg = '网络连接失败，请重新连接网络试试';
      } else if (err.message.indexOf('timeout') !== -1) {
        errMsg = '网络连接超时，请连上wifi试试';
      }
    }

    return Promise.reject(errMsg || '发生未知错误，请联系管理员~');
  }
);

export default axiosInstance;
