'use strict'

import React, {
  Component,
  StatusBar,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  View
} from 'react-native';
import Drawer from 'react-native-drawer';
import codePush from "react-native-code-push";
var SideMenu = require('./views/common/SideMenu');

var BackgroundProcess = require('./BackgroundProcess');

var NoticiasNavigator = require('./views/common/NoticiasNavigator');
var RallyNavigator = require('./views/rally/RallyNavigator');
var Contacto = require('./views/rally/Contacto');
var RegistroUsuarios = require('./views/admin/RegistroUsuarios');
var RegistroGrupos = require('./views/admin/RegistroGrupos');
var EnvioNotificaciones = require('./views/admin/EnvioNotificaciones');
var EstatusGruposNavigation = require('./navegaciones/EstatusGruposNavigation');
var RallyBar = require('./views/segments/RallyBar');

/* REDUX */
import type {State as User} from './reducers/user';
import type {State as Navigation} from './reducers/navigation';
var {
  toRallyHome,
  toMainHome,
  toContacto,
  toEstatus
} = require('./actions');
var { connect } = require('react-redux');
type Props = {
  user: User;
  navigation: Navigation;
  toMainHome: () => void;
  toRallyHome: () => void;
  toContacto: () => void;
  toEstatus: () => void;
};

class AppNavigator extends Component {
  props: Props;

  constructor(props) {
    super(props);
  }

  render() {
    codePush.sync();
    var bar = (<View/>);
    if(this.props.user.isLoggedIn && this.props.user.currentRally!=null) {
      bar = (
        <TouchableOpacity onPress={() => this.goToRally()} style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <RallyBar/>
        </TouchableOpacity>
      );
    }

    var component = null;
    if(this.props.navigation.pantalla === 'noticias') {
      component = (
        <View style={ styles.container }>
          <NoticiasNavigator openDrawer={this.openDrawer} drawer={this._drawerF}/>
          {bar}
        </View>
      );
    } else if(this.props.navigation.pantalla === 'rally'){
      component = (<RallyNavigator openDrawer={this.openDrawer} drawer={this._drawerF}/>);
    } else if(this.props.navigation.pantalla === 'registrousuarios'){
      component = (<RegistroUsuarios appnavigator={this.props.appnavigator} openDrawer={this.openDrawer} drawer={this._drawerF}/>);
    } else if(this.props.navigation.pantalla === 'registrogrupos'){
      component = (<RegistroGrupos openDrawer={this.openDrawer} drawer={this._drawerF} appnavigator={this.props.appnavigator}/>);
    } else if(this.props.navigation.pantalla === 'envioNotificaciones'){
      component = (<EnvioNotificaciones appnavigator={this.props.appnavigator} openDrawer={this.openDrawer} drawer={this._drawerF}/>);
    } else if(this.props.navigation.pantalla === 'contacto'){
      component = (<Contacto openDrawer={this.openDrawer} drawer={this._drawerF} appnavigator={this.props.appnavigator}/>);
    } else if(this.props.navigation.pantalla === 'estatus'){
      component = (<EstatusGruposNavigation openDrawer={this.openDrawer} drawer={this._drawerF}/>);
    } else {
      <View style={ styles.container }>
        <NoticiasNavigator openDrawer={this.openDrawer} drawer={this._drawerF}/>
        {bar}
      </View>
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
           content={<SideMenu openMenu={this.openDrawer}
                      appnavigator={this.props.appnavigator}
                      closeMenu={this.closeDrawer} />}
           tapToClose={true}
           openDrawerOffset={0.2} // 20% gap on the right side of drawer
           panCloseMask={0.2}
           closedDrawerOffset={-3}
           styles={{
             drawer: {shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 3},
             main: {paddingLeft: 3, backgroundColor: 'black'},
           }}
           tweenHandler={(ratio) => ({
             main: { opacity:(2-ratio)/2 }
           })}
           >
           {component}
        </Drawer>
        <BackgroundProcess/>
      </View>
    );
  }

  goToRally() {
    this.props.toRallyHome();
  }

  closeDrawer = () => {
    this._drawer.close()
  }

  openDrawer = () => {
    this._drawer.open()
  }

  _drawerF = () => {
    return this._drawer
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
    staff: store.staff,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
    toRallyHome: () => dispatch(toRallyHome()),
    toContacto: () => dispatch(toContacto()),
    toEstatus: () => dispatch(toEstatus()),
  };
}

module.exports = connect(select, actions)(AppNavigator);
