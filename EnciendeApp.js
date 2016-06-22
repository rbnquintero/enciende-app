'use strict';

import React, {
  Component,
  StyleSheet,
  Navigator,
  Platform,
  View
} from 'react-native';
import codePush from "react-native-code-push";
var GCMServices = require('./views/utils/GCMServices');

var AppNavigator = require('./AppNavigator');

class EnciendeApp extends Component {
  constructor(props) {
    super(props);
    GCMServices.subscribeTopic('general');
  }

  componentDidMount() {
    codePush.sync({installMode: codePush.InstallMode.IMMEDIATE});
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

  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <route.component
          appnavigator={navigator}
          {...route.passProps}
        />
      </View>
    );
  }

  render() {
    return (
      <Navigator
        style={{ flex:1 }}
        configureScene={ this.sceneConfig }
        onDidFocus={ this.didFocus }
        initialRoute={{ name:'AppNavigator', title:'AppNavigator', component: AppNavigator, }}
        renderScene={this.renderScene}
        openDrawer={this.props.openDrawer}
      />
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = EnciendeApp;
