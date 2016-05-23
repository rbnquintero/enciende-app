import React, {
  Component,
  Navigator,
  Platform,
  View
} from 'react-native';

var EstatusGrupos = require('../views/rally/admin/EstatusGrupos');

/* REDUX */
import type {State as User} from '../reducers/user';
var { connect } = require('react-redux');
var {
  fetchProfile,
  logOut,
} = require('../actions');
type Props = {
  user: User;
  updateProfile: () => void;
  logOut: () => void;
};

class EstatusGruposNavigation extends Component {
  props: Props;

  constructor(props) {
    super(props);
    //this.props.logOut();
    if (!this.props.user.isLoggedIn || !this.props.user.isRegistered || !this.props.user.currentRally== null) {
      this.props.updateProfile();
    }
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
  routeMapper(route, navigator) {
    return (
      <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
        <route.component
          navigator={navigator}
          {...route.passProps}/>
      </View>
    );
  }

  render() {
    return (
      <Navigator
        style={{ flex:1 }}
        configureScene={ this.sceneConfig }
        initialRoute={{ name:'EstatusGrupos', title:'Estatus Grupos', component: EstatusGrupos }}
        renderScene={ this.routeMapper }
        openDrawer={this.props.openDrawer}/>
    );
  }

}

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    updateProfile: () => dispatch(fetchProfile()),
    logOut: () => dispatch(logOut()),
  };
}

module.exports = connect(select, actions)(EstatusGruposNavigation);
