import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import todoList from './todoList';

const rootReducer = combineReducers({
  todoList,
  routing: routerReducer,
});

export default rootReducer;