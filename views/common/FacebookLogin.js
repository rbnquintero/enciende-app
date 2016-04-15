import React, {
  Component,
  TouchableHighlight,
  Text,
  TextInput,
  Image,
  StyleSheet,
  AsyncStorage,
  View
} from 'react-native';

var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

var LocalDBUtil = require('./../utils/LocalDBUtil');

class FacebookLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myuser: null,
      loading: true,
      error: false,
      userCode: '',
      localDBUtil: new LocalDBUtil(),
    };
    //this.state.localDBUtil.deleteAll();
    this.state.localDBUtil.getFacebookProfile(this);
  }

  _logIn(){
    var _this = this;
    _this.setState({ loading: true });
    console.log("to login");
    _this.state.localDBUtil.logInUsuario(this);
  }

  _register(){
    var _this = this;
    _this.setState({ loading: true });
    _this.state.localDBUtil.registerID(this);
    console.log('register ' + _this.state.userCode);
  }

  _onInputTextChanged(event) {
    this.setState({ userCode: event.nativeEvent.text });
  }

  render() {
    var loginSection;
    if(this.state.myuser == null && !this.state.loading) {
      loginSection = (
      <View style={ styles.centerAlign }>
        <Text style={ styles.text }>
          Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.
        </Text>
        <TouchableHighlight style={ styles.button } onPress={() => this._logIn()}
          underlayColor='#99d9f4'>
          <View style={{flexDirection: 'row'}}>
            <Image source={ require("image!flogo")} style={{width: 40, height: 20, marginLeft: 5, marginTop: 5, resizeMode: Image.resizeMode.contain,}}/>
            <Text style={[ styles.buttonText, { fontSize: 18, marginLeft: 0 } ]}>
              Iniciar sesión
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.button } onPress={() => this.props.navigator.pop()}
          underlayColor='#99d9f4'>
            <Text style={ styles.buttonText }>
              Cancelar
            </Text>
        </TouchableHighlight>
      </View>);
    } else if (this.state.myuser != null && !this.state.loading){
      if(this.state.myuser.userData == null) {
        loginSection = (
          <View style={[ styles.centerAlign ]}>
            <Text style={ styles.text }>
              Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.
            </Text>
            <View style={{backgroundColor: 'white', paddingHorizontal: 5, marginBottom: 20, backgroundColor: 'white', borderRadius: 5, }}>
              <TextInput placeholder='ID' onChange={this._onInputTextChanged.bind(this)} autoCapitalize='characters'
                style={{height: 30, width: 80}}/>
            </View>
            <TouchableHighlight style={ styles.button } onPress={() => this._register()}
              underlayColor='#99d9f4'>
              <View style={{flexDirection: 'row'}}>
                <Text style={[ styles.buttonText, { fontSize: 18, } ]}>
                  Registrar
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );
      } else {
        loginSection = (
          <View style={[ styles.centerAlign ]}>
            <Text>Logged in</Text>
            <TouchableHighlight onPress={ () => this.props.navigator.pop() }>
              <Text>
                Back
              </Text>
            </TouchableHighlight>
          </View>
        );
      }
    } else {
      loginSection = (
        <View style={[ styles.centerAlign ]}>
          <Text>Loading</Text>
        </View>
      );
    }

    return (
      <View style={ styles.mainContainer }>
        <View style={[ styles.centerAlignLogo ]}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-end'}}>
            <View>
              <Image source={ require('image!logo') } />
              <Text style={ styles.title} >
                enciende app
              </Text>
            </View>
          </View>
        </View>
        {loginSection}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, alignItems: 'center', backgroundColor: '#0059b3',
  },
  centerAlignLogo: {
    flex: 1, alignItems: 'center',
  },
  centerAlign: {
    flex: 2, alignItems: 'center',
  },
  text: {
    color: '#FFFFFF', marginVertical: 25, marginHorizontal: 35, textAlign: 'center', alignSelf: 'stretch'
  },
  title: {
    color:'#FFFFFF', fontWeight: 'bold', fontSize: 25, textAlign: 'center'
  },
  buttonText: {
    color:'#0059b3', textAlign: 'center', marginHorizontal: 10, marginVertical: 5
  },
  button: {
    backgroundColor: '#FFFFFF', borderRadius: 10, justifyContent: 'center', marginBottom: 20
  },
  zipCode: {
    width: 50, height: 16, borderWidth: 0,
  },
  zipContainer: {
    marginLeft: 5,
    marginTop: 3
  },
});

module.exports = FacebookLogin;
