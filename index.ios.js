/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component
} from 'react-native';

var AppNavigator = require('./AppNavigator');

class enciendeApp extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

AppRegistry.registerComponent('enciendeApp', () => enciendeApp);
