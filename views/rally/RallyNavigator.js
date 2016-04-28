import React, {
  Component,
  View,
  Navigator,
} from 'react-native';

var Home = require('./RallyHome');
var Actividades = require('./RallyActividades');

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
var {
  fetchProfile,
} = require('../../actions');
type Props = {
  user: User;
  fetchProfile: () => void;
};

class RallyNavigator extends Component {
  constructor(props) {
    super(props);
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
        initialRoute={{ name:'Inicio', title:'Inicio', component: component, }}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, backgroundColor: '#cccccc'}}>
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
  };
}

function actions(dispatch) {
  return {
    updateProfile: () => dispatch(fetchProfile()),
  };
}

module.exports = connect(select, actions)(RallyNavigator);
