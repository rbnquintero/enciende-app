import React, {
  Component,
  StyleSheet,
  Image,
  TouchableHighlight,
  Navigator,
  Text,
  View
} from 'react-native';

var Lobby = require('./Lobby');

var myRoute;

var NavBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    var previousRoute = navState.routeStack[index];
    return (
      <TouchableHighlight
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableHighlight>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {myRoute.title}
      </Text>
    );
  },
};

class AppNavigator extends Component {
  sceneConfig(route, routeStack) {
    return Navigator.SceneConfigs.PushFromRight
  }
  routeMapper(route, navigator) {
    if(route.name=="Lobby"){
      return (<Lobby navigator={navigator} />);
    } else {
      myRoute = route;
      return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View>
          <Navigator.NavigationBar
            navigator={navigator}
            navState={navigator.state}
            routeMapper={NavBarRouteMapper}/>
        </View>
        <route.component
          style={{flex: 1}}
          navigator={navigator} {...route.passProps} />
      </View>);
    }
  }

  render() {
    return (
      <Navigator
        style={{ flex:1 }}
        configureScene={ this.sceneConfig }
        initialRoute={{ name:'Lobby', title:'Inicio' }}
        renderScene={ this.routeMapper } />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
    //borderWidth: 2,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profPic: {
    flex: 1,
    height: 80,
    resizeMode: Image.resizeMode.contain
  },
  profData: {
    flex: 2,
    marginLeft: 20
  },
  profTitle: {
    fontSize: 35,
    fontWeight: 'bold'
  },
  profId: {
    fontSize: 15
  },
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
    paddingRight: 50,
  },
  navBarRightButton: {
    paddingRight: 10,
    paddingLeft: 50,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});

module.exports = AppNavigator;
