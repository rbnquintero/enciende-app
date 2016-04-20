import React, {
  Component,
  TouchableHighlight,
  Text,
  View
} from 'react-native';

import thunkMiddleware from 'redux-thunk';
//import createLogger from 'redux-logger'
import enciendeReducers from './reducers';

var AppNavigator = require('./AppNavigator');

var { Provider } = require('react-redux');
var { createStore, applyMiddleware } = require('redux');

let store = createStore(enciendeReducers, applyMiddleware(thunkMiddleware));


function setup(): Component {
  class Root extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      );
    }
  }

  return Root;
}

module.exports = setup;
