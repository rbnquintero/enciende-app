'use strict';

import React, {
  Component,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Drawer from 'react-native-drawer';
var SideMenu = require('./views/common/SideMenu');

var AppNavigator = require('./AppNavigator');
var RallyNavigator = require('./views/rally/RallyNavigator');
var RallyBar = require('./views/segments/RallyBar');

/* REDUX */
import type {State as User} from './reducers/user';
import type {State as Navigation} from './reducers/navigation';
var {
  toRallyHome,
  toMainHome,
  toContacto,
} = require('./actions');
var { connect } = require('react-redux');
type Props = {
  user: User;
  navigation: Navigation;
  toMainHome: () => void;
  toRallyHome: () => void;
  toContacto: () => void;
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

    var component = null;
    if(this.props.navigation.pantalla === 'noticias') {
      component = (
        <View style={ styles.container }>
          <AppNavigator openDrawer={this.openDrawer}/>
          {bar}
        </View>
      );
    } else {
      component = (<RallyNavigator openDrawer={this.openDrawer}/>);
    }
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
         />
         <Drawer
           ref={c => this._drawer = c}
           type="overlay"
           content={<SideMenu openMenu={this.openDrawer} closeMenu={this.closeDrawer} />}
           tapToClose={true}
           openDrawerOffset={0.2} // 20% gap on the right side of drawer
           panCloseMask={0.2}
           closedDrawerOffset={-3}
           styles={{
             drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
             main: {paddingLeft: 3},
           }}
           tweenHandler={(ratio) => ({
             main: { opacity:(2-ratio)/2 }
           })}
           >
           {component}
        </Drawer>
      </View>
    );
  }

  closeDrawer = () => {
    this._drawer.close()
  };
  openDrawer = () => {
    this._drawer.open()
  };

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
    toContacto: () => dispatch(toContacto()),
  };
}

module.exports = connect(select, actions)(EnciendeApp);
