import React, { Component, Suspense, PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider, Spin } from 'antd';
import { IntlProvider } from 'react-intl';
import Login from './containers/login';

import BasicLayout from './components/basic-layout';
import ErrorBoundary from './components/error-boundary';
import { en, zhCN } from './locales';
import routes from './config/routes';

import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';

@connect(state => ({ language: state.language, user: state.user.user }), null)
class App extends PureComponent {
  /*
    PureComponent: 纯组件：
      内部使用了 shouldComponentUpdate 类似的比较方案 -->
      根据新旧props和新旧state来判断是否要重新渲染：
        如果都相等，就不渲染
        如果有一个不想等，就渲染
      简单理解： PureComponent 是 shouldComponentUpdate 简写
      缺点：每次都会对比state和props，并且如果是数据是对象类型，只进行浅比较（只对比对象的第一层属性）
      问题：如果数据是对象，对象里面还有对象，这个是对比不出来的。

      最终总结：
        如果数据就是一层属性，就用PureComponent
        如果数据由多层属性，最好是通过shouldComponentUpdate去更新

        如果能够保证不修改原数据，产生一份新数据，那么也可以直接使用PureComponent
        (一定注意不能修改原数据：一旦修改原数据，新旧值就一样，更新就失败了~)

      React.memo() 给纯函数组件做性能优化
        内部实现对新旧props的比较。（为什么不对比state呢？因为纯函数组件没有state）
        类似于不对比state的PureComponent用法

      优点：减少组件的无效渲染。从而让组件性能更好
  */

  // shouldComponentUpdate() {
  //   /*
  //     根据新旧props和新旧state来判断是否要重新渲染：
  //       如果都相等，就不渲染
  //       如果有一个不想等，就渲染
  //   */
  //   // 更新
  //   return true;
  //   // 不更新
  //   // return false;
  // }

  render() {
    const { language, user } = this.props;
    const isEn = language === 'en';

    /*
      登录过，才有user数据，才需要对其权限管理
      没有登录过，访问 /login 页面，并本地没有user数据
        没有user数据就没有roleMenus，就不需要对其权限管理。
      
      判断有没有登录过？ 判断redux中是否有user数据
    */
    let filterRoutes = [];

    if (user) {
      // 获取用户权限菜单
      const roleMenus = user.menus;

      // filterRoutes = routes.filter(route => {
      //   // 如果 roleMenus 中有 /product ，应该允许访问：
      //   // /product /product/add /product/update/:id....
      //   return roleMenus.find(menu => {
      //     /* // 路径相等保留
      //       if (route.path === menu) {
      //         return true
      //       };
      //       // menu === '/product' --> 权限菜单有 /product权限
      //       // route.path如果是 /product开头 保留
      //       // 只要menu没有 /product , 就不会保留
      //       if (menu === '/product' && route.path.startsWith(menu)) {
      //         return true
      //       }
      //       return false */
      //     return (
      //       route.path === menu ||
      //       (menu === '/product' && route.path.startsWith(menu))
      //     );
      //   });
      // });

      /*
        获取到所有routes（所有路由），获取到用户权限（roleMenus）
        只有用户权限（roleMenus）允许访问的路由才能加载，所以过滤到没有权限的路由
          正常情况：用户权限（roleMenus）中的值和 routes中的path值 一一对应  （一对一）
          特殊情况：/product --> /product/update/xxx  /product/xxx /product/add ...（一对多）
      */

      /*
        使用filter过滤不属于roleMenus中的路由
          返回true，保留
          返回false，过滤
      */
      filterRoutes = routes.filter(route => {
        return roleMenus.find(menu => {
          return (
            // 处理正常情况：判断route.path是否属于roleMenus
            route.path === menu ||
            // 处理特殊情况：只有 menu === '/product' 才是特殊情况
            // String.prototype.startsWith()  判断是否以指定字符开头  ES6 String扩展
            (menu === '/product' && route.path.startsWith(menu))
          );
        });
      });
    }

    return (
      // ConfigProvider设置antd组件的国际化
      // IntlProvider设置自己文字的国际化
      <ConfigProvider locale={isEn ? en_US : zh_CN}>
        <IntlProvider
          locale={language} // 选择语言
          messages={isEn ? en : zhCN} // 选择语言包
        >
          <Router>
            {/* 
              lazy 必须配合 Suspense 一起使用。（Suspense必须包裹lazy）
                fallback 属性，组件会采用懒加载，没有加载完成是显示 fallback的值
                加载完成就会替换成对应的组件
            */}
            <Suspense fallback={<Spin size='large' />}>
              <Switch>
                <Route path='/login' exact component={Login} />
                <BasicLayout>
                  {filterRoutes.map(route => {
                    // return <Route path={route.path} exact={route.exact} component={route.component} />
                    return (
                      <ErrorBoundary key={route.path}>
                        <Route {...route} />
                      </ErrorBoundary>
                    );
                  })}
                </BasicLayout>
              </Switch>
            </Suspense>
          </Router>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default App;
