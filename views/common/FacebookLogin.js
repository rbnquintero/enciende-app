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

var AppLogo = require('../segments/AppLogo');

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
var {
  logIn,
  registerUser,
} = require('../../actions');
type Props = {
  user: User;
  logIn: () => void;
  registerUser: () => void;
};

class FacebookLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCode: '',
    };
    //this.state.localDBUtil.deleteAll();
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

  componentDidUpdate() {
    if(this.props.user.isLoggedIn && this.props.user.isRegistered && !this.props.user.isFetching) {
      this.props.navigator.pop();
    }
  }

  render() {
    var loginSection;
    if(!this.props.user.isLoggedIn && !this.props.user.isFetching) {
      loginSection = (
      <View style={ styles.centerAlign }>
        <Text style={ styles.text }>
          Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.
        </Text>
        <TouchableHighlight style={ styles.button } onPress={() => this.props.logIn()}
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
    } else if (this.props.user.isLoggedIn && !this.props.user.isFetching) {
      if(!this.props.user.isRegistered) {
        loginSection = (
          <View style={[ styles.centerAlign ]}>
            <Text style={ styles.text }>
              Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.
            </Text>
            <View style={{backgroundColor: 'white', paddingHorizontal: 5, marginBottom: 20, backgroundColor: 'white', borderRadius: 5, }}>
              <TextInput placeholder='ID' onChange={this._onInputTextChanged.bind(this)} autoCapitalize='characters'
                style={{height: 30, width: 80}}/>
            </View>
            <TouchableHighlight style={ styles.button } onPress={() => this.props.registerUser(this.props.user, this.state.userCode)}
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
          <AppLogo/>
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


function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    logIn: () => dispatch(logIn()),
    registerUser: (user, appToken) => dispatch(registerUser(user, appToken)),
  };
}

module.exports = connect(select, actions)(FacebookLogin);
