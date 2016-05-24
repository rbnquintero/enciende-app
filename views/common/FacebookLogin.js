import React, {
  Component,
  TouchableHighlight,
  TextInput,
  Image,
  StyleSheet,
  AsyncStorage,
  View
} from 'react-native';
var {Text, normalize} = require('../../js/common/Text');
var FitImage = require('../../js/common/FitImage');
var Header = require('../../js/common/Header');
var Loader = require('../helpers/LoaderSmall');

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
  }

  _onInputTextChanged(event) {
    this.setState({ userCode: event.nativeEvent.text });
  }

  componentDidUpdate() {
    if(this.props.user.isLoggedIn && this.props.user.isRegistered && !this.props.user.isFetching) {
      this.props.appnavigator.pop();
    }
  }

  render() {
    var loginSection;
    if(!this.props.user.isLoggedIn && !this.props.user.isFetching) {
      // Pantalla de log in con facebook
      loginSection = (
      <View style={styles.centerAlign}>
        <Text style={[ styles.texto, { fontSize: normalize(26) }]}>
          ¡Bienvenido!
        </Text>
        <Text style={[ styles.texto, { fontSize: normalize(16) }]}>
          Inicia sesión para conocer más sobre el Rally Enciende 2016. Descubre noticias y entérate de los próximos eventos.
        </Text>
        <TouchableHighlight style={ styles.button } onPress={() => this.props.logIn()}
          underlayColor='#99d9f4'>
          <View style={ styles.botonFacebook }>
            <Image source={ require("image!flogo")} style={ styles.logoFacebook }/>
            <Text style={[ styles.buttonText, { fontSize: normalize(13), fontWeight: '800', marginLeft: 10 } ]}>
              INICIAR SESIÓN CON FACEBOOK
            </Text>
          </View>
        </TouchableHighlight>
      </View>);
    } else if (this.props.user.isLoggedIn && !this.props.user.isFetching) {
      // Pantalla de registro de código
      if(!this.props.user.isRegistered) {
        loginSection = (
          <View style={[ styles.centerAlign ]}>
            <Text style={[ styles.texto, { fontSize: normalize(16) }]}>
              Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.
            </Text>
            <View style={ styles.input }>
              <TextInput placeholder='ID' onChange={this._onInputTextChanged.bind(this)} autoCapitalize='characters'
                style={{height: 30, width: 80}}/>
            </View>
            <TouchableHighlight style={ styles.button } onPress={() => this.props.registerUser(this.props.user, this.state.userCode)}
              underlayColor='#99d9f4'>
              <View style={{flexDirection: 'row'}}>
                <Text style={[ styles.buttonText, { fontSize: normalize(18), fontWeight: '800' } ]}>
                  REGISTRAR
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );
      } else {
        // El usuario ya inició sesión
        loginSection = (
          <View style={[ styles.centerAlign ]}>
            <Text style={[ styles.texto, { fontSize: normalize(26) }]}>
              ¡Bienvenido!</Text>
          </View>
        );
      }
    } else {
      // Loader
      loginSection = (
        <View style={[ styles.centerAlign ]}>
          <Loader/>
        </View>
      );
    }

    return (
      <View style={ styles.mainContainer}>
        <View style={ styles.container }>
          <FitImage source={require('image!loginbg')} style={ styles.mainContainer }
            content={
              <View style={{flex: 1}}>
                <View style={{flex: 5}}>
                  <Header
                    title="Iniciar sesión"
                    style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                    leftItem={{
                      layout: 'icon',
                      iconstyle: { height: 15, width: 15 },
                      title: 'Menu',
                      icon: require('../../js/common/img/x-white@3x.png'),
                      onPress: this.props.appnavigator.pop,
                    }}/>
                  <View style={{ alignItems: 'center', marginTop: -10}}>
                    <Image source={require('../../js/common/img/logo2.png')} style={styles.logo}/>
                  </View>
                </View>
                <View style={{flex: 4}}>
                  {loginSection}
                </View>
              </View>
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, flexWrap: 'wrap', alignSelf: 'stretch', overflow: 'hidden',
  },
  container: {
    flex: 1, flexWrap: 'wrap', flexDirection: 'row', alignSelf: 'stretch',
  },
  logo: {
    width: 150,
    resizeMode: Image.resizeMode.contain,
  },
  logoFacebook: {
    width: 20, height: 15, resizeMode: Image.resizeMode.contain,
  },
  texto: {
    marginHorizontal: 30, color: 'white', backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center'
  },
  input: {
    backgroundColor: 'white', paddingHorizontal: 5, marginTop: 20, backgroundColor: 'white', borderRadius: 5,
  },
  botonFacebook: {
    flexDirection: 'row', alignItems: 'center', paddingTop: normalize(5)
  },
  centerAlign: {
    flex: 2, alignItems: 'center',
  },
  buttonText: {
    color:'white', textAlign: 'center', marginLeft: 10, marginVertical: 5
  },
  button: {
    backgroundColor: 'rgb(59,89,152)', borderRadius: 5, alignItems: 'center', height: normalize(40), left: 30, right: 30, bottom: 30, position: 'absolute'
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
