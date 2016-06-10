import React, {
  Component,
  View,
  Navigator,
} from 'react-native';

var RegistroGrupos = require('./RegistroGrupos');

/* REDUX */
import type {State as User} from '../../reducers/user';
import BackPress from '../../js/common/BackPress';

var { connect } = require('react-redux');
type Props = {
  user: User;
};

var _this;
class AdminNavigator extends Component {
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
    }console.log(this.props);

    return (
      <Navigator
        style={{ flex:1 }}
        ref={view => this.navigation = view}
        configureScene={ this.sceneConfig }
        initialRoute={{ name:'Inicio', title:'Inicio', component: RegistroGrupos, }}
        renderScene={this.renderScene}
        openDrawer={this.props.openDrawer}
      />
    );
  }

  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
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

  };
}

module.exports = connect(select, actions)(AdminNavigator);
