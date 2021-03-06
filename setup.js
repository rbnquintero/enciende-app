import React, {
  Component,
  TouchableHighlight,
  StatusBar,
  View
} from 'react-native';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger'
import enciendeReducers from './reducers';

var EnciendeApp = require('./EnciendeApp');

var { Provider } = require('react-redux');
var { createStore, applyMiddleware } = require('redux');

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

let store = createStore(enciendeReducers, applyMiddleware(thunkMiddleware, logger));

class Setup extends Component {
  render() {
    return (
      <Provider store={store}>
        <EnciendeApp />
      </Provider>
    );
  }
}

module.exports = Setup;
