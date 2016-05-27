import React, {
  Component,
  View,
  Navigator,
} from 'react-native';

var Actividades = require('./RallyActividades');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
import BackPress from '../../js/common/BackPress';

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

    if (!this.props.user.isLoggedIn || !this.props.user.isRegistered || !this.props.user.currentRally== null) {
      this.props.updateProfile(null, this.props.user.currentRally.grupo.grupoId);
    }
    _this = this;
  }
  componentDidMount() {
      this.backPress = new BackPress(this.navigation,this.props.drawer);
  }

  componentWillUnmount() {
    this.backPress.removeListener();
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

    return (
      <Navigator
        style={{ flex:1 }}
        ref={view => this.navigation = view}
        configureScene={ this.sceneConfig }
        onDidFocus={ this.didFocus.bind(this) }
        initialRoute={{ name:'Inicio', title:'Inicio', component: Actividades, }}
        renderScene={this.renderScene}
        openDrawer={this.props.openDrawer}
      />
    );
  }

  didFocus(route) {
    if(this.props.actividadesUser.actividades.length > 0) {
      this.props.refreshUserActividades(this.props.actividadesUser.actividades, this.props.user.currentRally.grupo.grupoId);
    } else {
      this.props.loadUserActividades(this.props.user.currentRally.grupo.idGrupo);
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
    updateProfile: (actividades, grupoId) => dispatch(fetchProfile(actividades, grupoId)),
    loadUserActividades: (grupoId) => dispatch(loadActUser(grupoId)),
    refreshUserActividades: (actividades, grupoId) => dispatch(fetchActUser(actividades, grupoId)),
    logOut: () => dispatch(logOut()),
  };
}

module.exports = connect(select, actions)(RallyNavigator);
