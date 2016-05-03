import React, {
  Component,
  View,
  Navigator,
} from 'react-native';

var Home = require('./RallyHome');
var Actividades = require('./RallyActividades');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
var { connect } = require('react-redux');
var {
  fetchProfile,
  loadActUser,
  fetchActUser,
  logOut,
} = require('../../actions');
type Props = {
  user: User;
  actividadesUser: ActividadesUser;
  fetchProfile: () => void;
  loadUserActividades: () => void;
  refreshUserActividades: () => void;
  logOut: () => void;
};

var _this;
class RallyNavigator extends Component {
  constructor(props) {
    super(props);
    //this.props.logOut();
    if (!this.props.user.isLoggedIn || !this.props.user.isRegistered || !this.props.user.currentRally== null) {
      this.props.updateProfile();
    }
    _this = this;
  }
  sceneConfig(route, routeStack) {
    if(route.fromBottom!=null){
      if(Platform.OS === 'ios') {
        return Navigator.SceneConfigs.FloatFromBottom;
      } else {
        return Navigator.SceneConfigs.FloatFromBottomAndroid;
      }
    } else {
      return Navigator.SceneConfigs.PushFromRight;
    }
  }

  render() {
    if(!this.props.user.isLoggedIn || !this.props.user.isRegistered || this.props.user.currentRally == null) {
      return null;
    }
    var rally = this.props.user.currentRally.grupo.rally;
    var now = new Date();
    var fecha = new Date(rally.fechaInicio);
    var component = Home;
    if (now > fecha) {
      component = Actividades;
    }

    return (
      <Navigator
        style={{ flex:1 }}
        configureScene={ this.sceneConfig }
        onDidFocus={ this.didFocus }
        initialRoute={{ name:'Inicio', title:'Inicio', component: component, }}
        renderScene={this.renderScene}
        openDrawer={this.props.openDrawer}
      />
    );
  }

  didFocus(route) {
    if(_this.props.actividadesUser.actividades.length > 0) {
      _this.props.refreshUserActividades();
    } else {
      _this.props.loadUserActividades();
    }
  }

  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <route.component
          navigator={navigator}
          {...route.passProps}
        />
      </View>
    );
  }
}

function select(store) {
  return {
    user: store.user,
    actividadesUser: store.actividadesUser,
  };
}

function actions(dispatch) {
  return {
    updateProfile: () => dispatch(fetchProfile()),
    loadUserActividades: () => dispatch(loadActUser()),
    refreshUserActividades: () => dispatch(fetchActUser()),
    logOut: () => dispatch(logOut()),
  };
}

module.exports = connect(select, actions)(RallyNavigator);
