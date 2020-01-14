import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/home';
import Login from './containers/login';

import BasicLayout from './components/basic-layout';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' exact component={Login} />
          <BasicLayout>
            <Route path='/' exact component={Home} />
          </BasicLayout>
        </Switch>
      </Router>
    );
  }
}
