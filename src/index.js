import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AdminContainer from './containers/AdminContainer';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';

import 'antd/dist/antd.less';
import './styles/index.less';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AdminContainer />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
