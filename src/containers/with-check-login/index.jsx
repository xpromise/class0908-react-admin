/**
 * 用来检测登录的高阶组件
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default function withCheckLogin(WrappedComponent) {
  @connect(state => ({ user: state.user }), null)
  class CheckLogin extends Component {
    // 给组件命名
    static displayName = `checkLogin(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    render() {
      /*
        判断是否登录过： redux --> user
          获取redux数据两种方式：
            connect 用于组件
            store.getState 用于非组件

        获取访问地址；location.pathname 
          将来会给Login/Home组件使用。所以向外暴露的是CheckLogin组件，
          CheckLogin组件引用在Route上，所有具体路由组件特点
        
        跳转网址有两种方式：
          Redirect 用于render方法中
          this.props.history.push/replace 用于非render方式中

        如果登录过，
          访问 / /category，(访问不是 /login )可以访问
          访问 /login, 跳转到 /
        如果没有登录过
          访问 / /category，(访问不是 /login )跳转到 /login
          访问 /login, 可以访问
      */

      const {
        user: { token },
        location: { pathname }
      } = this.props;

      console.log(pathname);

      if (token) {
        // 登录过
        if (pathname === '/login') {
          // 跳转到主页
          return <Redirect to='/' />;
        }
      } else {
        // 没有登录过
        if (pathname !== '/login') {
          // 跳转到主页
          return <Redirect to='/login' />;
        }
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  return CheckLogin;
}
