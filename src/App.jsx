import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import Login from './containers/login';

import BasicLayout from './components/basic-layout';
import { en, zhCN } from './locales';
import routes from './config/routes';

import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';

@connect(state => ({ language: state.language, user: state.user.user }), null)
class App extends Component {
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
            <Switch>
              <Route path='/login' exact component={Login} />
              <BasicLayout>
                {filterRoutes.map(route => {
                  // return <Route path={route.path} exact={route.exact} component={route.component} />
                  return <Route {...route} key={route.path} />;
                })}
              </BasicLayout>
            </Switch>
          </Router>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default App;
