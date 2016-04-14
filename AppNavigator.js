import React, {
  Component,
  StyleSheet,
  Image,
  TouchableHighlight,
  Navigator,
  Platform,
  Text,
  View
} from 'react-native';

var Lobby = require('./FacebookLoginTest');
var Home = require('./views/common/Home');

var myRoute;

var NavBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    var previousRoute = navState.routeStack[index];
    console.log("routeStack", navState.routeStack);
    console.log(previousRoute);
    if(navState.routeStack.length > 1) {
      if(Platform.OS === 'ios') {
        return (
          <TouchableHighlight
            onPress={() => navigator.pop()}
            style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              {previousRoute.title}
            </Text>
          </TouchableHighlight>
        );
      } else {
        return (
          <TouchableHighlight
            onPress={() => navigator.pop()}
            style={styles.navBarLeftButton}>
            <View style={{flexDirection:'row'}}>
              <Image style={{marginVertical: 16, marginRight: 15, resizeMode: Image.resizeMode.stretch, width: 25, height: 25}} source={require("image!android_back_white")}/>
              <Text style={[styles.navBarTextAndroid, styles.navBarButtonText]}>
                {route.title}
              </Text>
            </View>
          </TouchableHighlight>
        );
      }
    } else {
      if(Platform.OS === 'ios') {
        return null;
      } else {
        return(
          <View style={styles.logoContainerAndroid}>
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              enciende
            </Text>
            <Image style={styles.logo} source={require('image!logo')} />
          </View>
        );
      }
    }
  },

  RightButton: function(route, navigator, index, navState) {
    if(Platform.OS === 'ios') {
      return (
        <TouchableHighlight>
          <View style={styles.accountContainer}>
            <Image style={styles.account} source={{ uri: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/12495144_1249559848391461_6669135379859786016_n.jpg?oh=cc6504b8118a652c0ce7eb97b37acabf&oe=57AD94A0'}} />
          </View>
        </TouchableHighlight>
      );
    } else {
      return(
        <TouchableHighlight style={{marginTop:7}}>
          <View style={styles.accountContainer}>
            <Image style={styles.account} source={{ uri: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/12495144_1249559848391461_6669135379859786016_n.jpg?oh=cc6504b8118a652c0ce7eb97b37acabf&oe=57AD94A0'}} />
          </View>
        </TouchableHighlight>
      );
    }
  },

  Title: function(route, navigator, index, navState) {
    if(Platform.OS === 'ios') {
      return (
        <View style={styles.logoContainer}>
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            enciende
          </Text>
          <Image style={styles.logo} source={require('image!logo')} />
        </View>
      );
    } else {
      return null;
    }
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
      console.log(route);
      myRoute = route;
      return (
      <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
        <View>
          <Navigator.NavigationBar style={{backgroundColor: '#0059b3'}}
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
        initialRoute={{ name:'Home', title:'Inicio', component: Home }}
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
  navBarTextAndroid: {
    fontSize: 25,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: 'white',
    fontSize: 20,
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
    color: 'white',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  logoContainer: {
    flexDirection: 'row',
  },
  logoContainerAndroid: {
    flexDirection: 'row',
    margin: 5,
  },
  logo: {
    marginTop: 3,
    width: 30,
    height: 30,
  },
  accountContainer: {
    flex:1,
    alignItems: 'center',
  },
  account: {
    marginRight: 5,
    marginTop: 3,
    borderColor: '#cce6ff',
    borderRadius: 17,
    borderWidth: 1,
    width: 36,
    height: 36,
    resizeMode: Image.resizeMode.center,
  }
});

module.exports = AppNavigator;
