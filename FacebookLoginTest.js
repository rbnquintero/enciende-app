import React, {
  Component,
  TouchableHighlight,
  Text,
  AsyncStorage,
  View
} from 'react-native';

var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

class FacebookLoginTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myuser: null,
    };
  }

  _logIn(){
    var _this = this;
    console.log("to login");
    FBLoginManager.loginWithPermissions(["public_profile","email"], function(error, data) {
      if (!error) {
        console.log("login data: ", data);
        _this.setState({ myuser: data });
      } else {
        console.log("data: ", data);
        console.log("error: ", error);
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 64 }}>
        <TouchableHighlight onPress={ this._logIn.bind(this) }>
          <Text>
            Some
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = FacebookLoginTest;
