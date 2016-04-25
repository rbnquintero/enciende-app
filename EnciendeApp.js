'use strict';

import React, {
  Component,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

var AppNavigator = require('./AppNavigator');

class EnciendeApp extends Component {

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
         />
        <AppNavigator />
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = EnciendeApp;
