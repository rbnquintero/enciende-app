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
var FacebookLogin = require('./FacebookLogin');

/* REDUX */
import type {State as Navigation} from '../../reducers/navigation';
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
var {
  toMainHome, toRallyHome, toContacto, toEstatus, toPantallaRegistroUsr, toPantallaRegistroGrp,
  logOut,
} = require('../../actions');
type Props = {
  user: User;
  navigation: Navigation;
  logOut: () => void;
  toMainHome: () => void;
  toRallyHome: () => void;
  toContacto: () => void;
  toEstatus: () => void;
  toPantallaRegistroUsr: () => void;
  toPantallaRegistroGrp: () => void;
};

class SideMenu extends Component {
  constructor(props) {
    super(props);
  }

  goToLogIn() {
    this.props.appnavigator.push({
      title: "Inicio de Sesión",
      name: 'LogIn',
      component: FacebookLogin,
      fromBottom: true,
    });
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
    if(this.props.user.isRegistered && this.props.user.currentRally != null) {
      selected = false;
      if(this.props.navigation.pantalla === 'rally') {
        selected = true;
      }
      var tituloRally = 'Rally ' + this.props.user.currentRally.grupo.rally.nombre;
      rally  = (<SideMenuItem titulo={tituloRally} selected={selected} rally={true} action={() => {this.props.closeMenu(); this.props.toRallyHome();}}/>);
    }

    /* Admin opts */
    var registroparticipantes = null;
    var estatusGrupos = null;
    var registrogrupos = null;
    var admin = null;
    if(this.props.user.isRegistered) {
      if(this.props.user.currentRally != null && this.props.user.currentRally.rol !== 'PARTICIPANTE'){
        selected = false;
        if(this.props.navigation.pantalla === 'ESTATUS') {
          selected = true;
        }
        estatusGrupos = (
          <SideMenuItem titulo="Estatus Grupos" selected={selected} action={() => {this.props.closeMenu(); this.props.toEstatus();}}/>
        );
      }
      if(this.props.user.currentRally != null && this.props.user.currentRally.rol === 'ADMIN') {
        // Usuario es admin
        admin = (
          <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, marginTop: 10, borderColor: 'gray', paddingHorizontal: 10, height: 35 }}>
            <Text style={{ color: 'gray', fontSize: 13, fontWeight: '400' }}>Admin</Text>
          </View>);
        selected = false;
        if(this.props.navigation.pantalla === 'registrousuarios') {
          selected = true;
        }
        var registroparticipantes = (
          <SideMenuItem titulo="Registro de Usuarios" selected={selected} action={() => {this.props.closeMenu(); this.props.toPantallaRegistroUsr();}}/>
        );

        selected = false;
        if(this.props.navigation.pantalla === 'registrogrupos') {
          selected = true;
        }
        var registrogrupos = (
          <SideMenuItem titulo="Registro de Grupos" selected={selected} action={() => {this.props.closeMenu(); this.props.toPantallaRegistroGrp();}}/>
        );
      }



      var cerrar = null;
      cerrar = (<SideMenuItem titulo="Cerrar sesión"
                  action={() => {
                    Alert.alert(
                      'Cerrar sesión',
                      '¿Estas seguro de cerrar sesión?',
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: () => {this.props.toMainHome(); this.props.logOut(this.props.navigator);}},
                      ]
                    )
                  }}
                />);
    }

    /* User info */
    var userinfo = (
      <TouchableOpacity onPress={() => this.goToLogIn()}>
        <View
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: 'rgb(140,51,204)' }}>
          <Image source={ require('image!profile')} style={{ resizeMode: Image.resizeMode.contain, height: 60, width: 60, margin: 10 }}/>
          <Text style={{ margin: 10, color: 'white', fontSize: 13, fontWeight: '400' }}>Inicia sesión</Text>
        </View>
      </TouchableOpacity>
    );

    if(this.props.user.isRegistered) {
      var infoRally = null;
      if (this.props.user.currentRally != null) {
        infoRally = (
          <View>
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
        );
      }
      userinfo = (
        <View
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: 'rgb(140,51,204)', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: this.props.user.fbData.picture.data.url }}
            style={{ resizeMode: Image.resizeMode.contain, height: 60, width: 60, margin: 10 }}/>
            <View>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>{this.props.user.userData.nombre}</Text>
              {infoRally}
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
          {estatusGrupos}
          {admin}
          {registroparticipantes}
          {registrogrupos}
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
    toEstatus: () => dispatch(toEstatus()),
    toPantallaRegistroUsr: () => dispatch(toPantallaRegistroUsr()),
    toPantallaRegistroGrp: () => dispatch(toPantallaRegistroGrp()),
    logOut: () => dispatch(logOut()),
  };
}

module.exports = connect(select, actions)(SideMenu);
