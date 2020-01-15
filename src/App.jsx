import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import Home from './components/home';
import Login from './containers/login';

import BasicLayout from './components/basic-layout';
import { en, zhCN } from './locales';

export default class App extends Component {
  render() {
    const language = navigator.language || navigator.languages[0] || 'zh-CN';
    const messages = language === 'en' ? en : zhCN;

    return (
      <IntlProvider
        locale={language} // 选择语言
        messages={messages} // 选择语言包
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
    );
  }
}
