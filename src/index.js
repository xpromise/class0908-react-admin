import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';

import './index.less';

ReactDOM.render(
  // Provider组件：向子组件提供store对象
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
