import React from 'react';
// 引入axios是Axios的实例，里面包含axios默认配置
import axios from 'axios';
import { message } from 'antd';

export default function Test() {
  // 配置axios拦截器

  // 自己创建axios实例，可以修改axios默认配置
  const axiosInstance = axios.create({
    baseURL: '/api', // 基础路径（公共路径）: 后面所有请求路径都会以 baseURL 开头
    timeout: 20000, // 20s: 请求超时时间: 请求一旦超过10s还没有响应，就会自动中断请求
    headers: {
      // 公共的请求头
      // 参数必须写死
    }
  });

  // 设置拦截器
  // 请求拦截器(在发送请求之前调用)
  axiosInstance.interceptors.request.use(
    // 设置发送请求，代码成功（还没有发送请求）
    config => {
      // config是一个对象，里面包含所有发送请求的配置
      // 修改config配置
      // 添加动态headers参数

      // console.log(config);
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }

      return config;
    }
    // 设置发送请求，代码失败
    // 一般是不会有问题的，所以这个函数没啥用
    /* (error) => {
      // error失败的原因
      // 返回一个失败的promise对象
      return Promise.reject(err);
    } */
  );
  // 响应拦截器(返回响应之后，触发axiosInstance.then/catch之前调用)
  /* axiosInstance.interceptors.response.use(
    // 请求/响应成功 --> 2xx
    (response) => {
      return response;
    },
    // 请求/响应失败 --> 4xx 5xx
    () => {}
  ); */

  let token = '';
  let id = '';

  const handleClick1 = () => {
    axiosInstance({
      method: 'POST',
      url: '/login',
      data: {
        username: 'admin',
        password: 'admin'
      }
    })
      .then(response => {
        console.log(response);

        if (response.data.status === 0) {
          token = response.data.data.token;
          message.success('登录成功');
        } else {
          message.error(response.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error('网络错误');
      });
  };

  const handleClick2 = () => {
    axiosInstance({
      method: 'POST',
      url: '/category/add',
      data: {
        categoryName: '手机'
      }
      /* headers: {
        authorization: `Bearer ${token}`
      } */
    })
      .then(response => {
        if (response.data.status === 0) {
          id = response.data.data._id;
          message.success('添加成功');
        } else {
          message.error(response.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error('网络错误');
      });
  };

  const handleClick3 = () => {
    axiosInstance({
      method: 'POST',
      url: '/category/delete',
      data: {
        categoryId: id
      }
      /* headers: {
        authorization: `Bearer ${token}`
      } */
    })
      .then(response => {
        if (response.data.status === 0) {
          message.success('删除分类成功');
        } else {
          message.error(response.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error('网络错误');
      });
  };

  return (
    <div>
      <button onClick={handleClick1}>按钮1</button>
      <button onClick={handleClick2}>按钮2</button>
      <button onClick={handleClick3}>按钮3</button>
    </div>
  );
}

/* export default function Test() {

  let token = '';
  let id = '';

  const handleClick1 = () => {
    axios({
      method: 'POST',
      url: '/api/login',
      data: {
        username: 'admin',
        password: 'admin'
      }
    })
      .then(response => {
        if (response.data.status === 0) {
          token = response.data.data.token;
          message.success('登录成功');
        } else {
          message.error(response.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error('网络错误');
      });
  };

  const handleClick2 = () => {
    axios({
      method: 'POST',
      url: '/api/category/add',
      data: {
        categoryName: '手机'
      },
      headers: {
        authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.status === 0) {
          id = response.data.data._id;
          message.success('添加成功');
        } else {
          message.error(response.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error('网络错误');
      });
  };

  const handleClick3 = () => {
    axios({
      method: 'POST',
      url: '/api/category/delete',
      data: {
        categoryId: id
      },
      headers: {
        authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.status === 0) {
          message.success('删除分类成功');
        } else {
          message.error(response.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error('网络错误');
      });
  };

  return (
    <div>
      <button onClick={handleClick1}>按钮1</button>
      <button onClick={handleClick2}>按钮2</button>
      <button onClick={handleClick3}>按钮3</button>
    </div>
  );
} */
