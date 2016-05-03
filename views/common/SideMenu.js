import React, {
  Component,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Image,
  Platform,
} from 'react-native';

var STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;

var SideMenuItem = require('./home/SideMenuItem');

/* REDUX */
import type {State as Navigation} from '../../reducers/navigation';
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
var {
  toMainHome, toRallyHome, toContacto,
  logOut,
} = require('../../actions');
type Props = {
  user: User;
  navigation: Navigation;
  logOut: () => void;
  toMainHome: () => void;
  toRallyHome: () => void;
  toContacto: () => void;
};

class SideMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    /* Menu maker */
    var selected = false;
    if(this.props.navigation.pantalla === 'noticias') {
      selected = true;
    }
    var noticias = (
      <SideMenuItem titulo="Noticias enciende" selected={selected} action={() => {this.props.closeMenu(); this.props.toMainHome();}}/>
    );

    selected = false;
    if(this.props.navigation.pantalla === 'contacto') {
      selected = true;
    }
    var contacto = (
      <SideMenuItem titulo="Contacto" selected={selected} action={() => {this.props.closeMenu(); this.props.toContacto();}}/>
    );

    var rally = null;
    var cerrar = null;
    selected = false;
    if(this.props.navigation.pantalla === 'rally') {
      selected = true;
    }
    if(this.props.user.isRegistered) {
      var tituloRally = 'Rally ' + this.props.user.currentRally.grupo.rally.nombre;
      rally  = (<SideMenuItem titulo={tituloRally} selected={selected} action={() => {this.props.closeMenu(); this.props.toRallyHome();}}/>);
      cerrar = (<SideMenuItem titulo="Cerrar sesión"
                  action={() => {
                    Alert.alert(
                      'Cerrar sesión',
                      '¿Estas seguro de cerrar sesión?',
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: () => {this.props.logOut(this.props.navigator)}},
                      ]
                    )
                  }}
                />);
    }

    /* User info */
    var userinfo = (
      <TouchableOpacity>
        <View
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: '#6600cc' }}>
          <Image source={ require('image!profile')} style={{ resizeMode: Image.resizeMode.contain, height: 60, width: 60, margin: 10 }}/>
          <Text style={{ margin: 10, color: 'white', fontSize: 13, fontWeight: '400' }}>Inicia sesión</Text>
        </View>
      </TouchableOpacity>
    );
    if(this.props.user.isRegistered) {
      userinfo = (
        <View
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: '#6600cc', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: this.props.user.fbData.picture.data.url }}
            style={{ resizeMode: Image.resizeMode.contain, height: 60, width: 60, margin: 10 }}/>
            <View>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>{this.props.user.userData.nombre}</Text>
              <Text style={{ fontWeight: '200', color: 'white', marginTop: 5, fontSize: 11 }}>
                Rally {this.props.user.currentRally.grupo.rally.nombre}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{ paddingRight: 10, color: 'white', fontWeight: '200', fontSize: 11 }}>
                  {this.props.user.currentRally.grupo.nombre}
                </Text>
                <Text style={{ fontWeight: '200', color: 'white', fontSize: 11 }}>
                  Talla camiseta: {this.props.user.userData.tallaPlayera}
                </Text>
              </View>
            </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
        {userinfo}
        <View style={{ marginVertical: 10 }}>
          {noticias}
          {rally}
          <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, marginTop: 10, borderColor: 'gray', paddingHorizontal: 10, height: 35 }}>
            <Text style={{ color: 'gray', fontSize: 13, fontWeight: '400' }}>Información</Text>
          </View>
          {contacto}
          {cerrar}
        </View>
      </View>
    );
  }
}
function select(store) {
  return {
    user: store.user,
    navigation: store.navigation,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
    toRallyHome: () => dispatch(toRallyHome()),
    toContacto: () => dispatch(toContacto()),
    logOut: () => dispatch(logOut()),
  };
}

module.exports = connect(select, actions)(SideMenu);