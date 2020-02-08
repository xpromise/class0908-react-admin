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
      登录过 user就有
      没有登录过 user为undefined
    */
    let filterRoutes = [];
    
    if (user) {
      const roleMenus = user.menus;
      // 对route进行权限管理
      filterRoutes = routes.filter(route => {
        // 如果 roleMenus 中有 /product ，应该允许访问：
        // /product /product/add /product/update/:id....
        return roleMenus.find(menu => {
          /* // 路径相等保留
            if (route.path === menu) {
              return true
            };
            // menu === '/product' --> 权限菜单有 /product权限
            // route.path如果是 /product开头 保留
            // 只要menu没有 /product , 就不会保留
            if (menu === '/product' && route.path.startsWith(menu)) {
              return true
            }
            return false */
          return (
            route.path === menu ||
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
