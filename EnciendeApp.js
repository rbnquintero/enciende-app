'use strict';

import React, {
  Component,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

var AppNavigator = require('./AppNavigator');
var RallyNavigator = require('./views/rally/RallyNavigator');
var RallyBar = require('./views/segments/RallyBar')

/* REDUX */
import type {State as User} from './reducers/user';
import type {State as Navigation} from './reducers/navigation';
var {
  toRallyHome,
  toMainHome,
} = require('./actions');
var { connect } = require('react-redux');
type Props = {
  user: User;
  navigation: Navigation;
  toMainHome: () => void;
  toRallyHome: () => void;
};

class EnciendeApp extends Component {
  constructor(props) {
    super(props);
  }

  goToRally() {
    console.log("To Rally!", this.props);
    this.props.toRallyHome();
  }

  render() {
    var bar = (<View/>);
    if(this.props.user.isLoggedIn && this.props.user.currentRally!=null) {
      bar = (
        <TouchableOpacity onPress={() => this.goToRally()}>
          <RallyBar />
        </TouchableOpacity>
      );
    }

    if(this.props.navigation.flujoNormal) {
      return (
        <View style={styles.container}>
          <StatusBar
            translucent={true}
            backgroundColor="rgba(0, 0, 0, 0.2)"
            barStyle="light-content"
           />
          <AppNavigator />
          {bar}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar
            translucent={true}
            backgroundColor="rgba(0, 0, 0, 0.2)"
            barStyle="light-content"
           />
          <RallyNavigator/>
        </View>
      );
    }
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function select(store) {
  return {
    user: store.user,
    navigation: store.navigation,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
    toRallyHome: () => dispatch(toRallyHome()),
  };
}

module.exports = connect(select, actions)(EnciendeApp);
