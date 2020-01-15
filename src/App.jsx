import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import Home from './components/home';
import Login from './containers/login';

import BasicLayout from './components/basic-layout';
import { en, zhCN } from './locales';

import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';

@connect(state => ({ language: state.language }), null)
class App extends Component {
  render() {
    const language = this.props.language;
    const isEn = language === 'en';

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
                <Route path='/' exact component={Home} />
              </BasicLayout>
            </Switch>
          </Router>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default App;
