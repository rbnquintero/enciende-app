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
var FacebookLogin = require('./views/common/FacebookLogin');
var Perfil = require('./views/common/Perfil');

var LocalDBUtil = require('./views/utils/LocalDBUtil');

var myRoute;
var myNavigator;
var myAppNavigator;

var NavBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    myNavigator = navigator;
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
    var image;
    if(myAppNavigator.state.myuser == null) {
      image = (
        <Image style={[styles.account, { backgroundColor: 'white' }]} source={ require('image!profile') } />
      );
    } else {
      image = (
        <Image style={styles.account} source={{ uri: myAppNavigator.state.myuser.fbData.picture.data.url }} />
      );
    }
    if(Platform.OS === 'ios') {
      return (
        <TouchableHighlight onPress={() => myAppNavigator.profilePressed()}>
          <View style={styles.accountContainer}>
            {image}
          </View>
        </TouchableHighlight>
      );
    } else {
      return(
        <TouchableHighlight onPress={() => myAppNavigator.profilePressed()} style={{marginTop:7}}>
          <View style={styles.accountContainer}>
            {image}
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
  constructor(props) {
    super(props);
    myAppNavigator = this;
    this.state = {
      localDBUtil: new LocalDBUtil(),
      myuser: null
    };
    this.state.localDBUtil.getPerfilData(this);
    //this.state.localDBUtil.deleteAll();
  }

  sceneConfig(route, routeStack) {
    return Navigator.SceneConfigs.PushFromRight
  }
  routeMapper(route, navigator) {
    if(route.name=="Lobby" || route.name=="Facebook Login"){
      return (<route.component navigator={navigator} {...route.passProps}/>);
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

  profilePressed() {
    if (this.state.myuser.userData == null){
      myNavigator.push({
        title: "Facebook Login",
        name: 'Facebook Login',
        component: FacebookLogin,
        passProps: { navBar: myAppNavigator }
      });
    } else {
      myNavigator.push({
        title: "Perfil",
        name: 'Perfil',
        component: Perfil,
        passProps: { navBar: myAppNavigator }
      });
    }
  }

  render() {
    //initialRoute={{ name:'Facebook Login', title:'Inicio', component: FacebookLogin }}
    return (
      <Navigator
        style={{ flex:1 }}
        configureScene={ this.sceneConfig }
        initialRoute={{ name:'Inicio', title:'Inicio', component: Home, passProps: { navBar: myAppNavigator } }}
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
