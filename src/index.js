import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import AdminContainer from './containers/AdminContainer';
import TodoListContainer from './containers/TodoListContainer';
import ImageUploadContainer from './containers/ImageUpload';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';

import 'antd/dist/antd.less';
import './styles/index.less';

const store = configureStore();

const routerSet = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={AdminContainer} />
        <Route path="/todoList" component={TodoListContainer} />
        <Route path="/imageUpload" component={ImageUploadContainer} />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <Provider store={store}>
    {routerSet()}
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
