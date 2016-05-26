import React, {
  Component,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
var {Text} = require('../../js/common/Text');

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
      <SideMenuItem titulo="Noticias enciende" icon={require('image!icon_noticias')} selected={selected} action={() => {this.props.closeMenu(); this.props.toMainHome();}}/>
    );

    selected = false;
    if(this.props.navigation.pantalla === 'contacto') {
      selected = true;
    }
    var contacto = (
      <SideMenuItem titulo="Contacto" icon={require('image!icon_contacto')} selected={selected} action={() => {this.props.closeMenu(); this.props.toContacto();}}/>
    );

    var rally = null;
    if(this.props.user.isRegistered && this.props.user.currentRally != null) {
      selected = false;
      if(this.props.navigation.pantalla === 'rally') {
        selected = true;
      }
      var tituloRally = 'Rally ' + this.props.user.currentRally.grupo.rally.nombre;
      rally  = (<SideMenuItem titulo={tituloRally} icon={require('image!icon_rally')} selected={selected} rally={true} action={() => {this.props.closeMenu(); this.props.toRallyHome();}}/>);
    }

    /* Admin opts */
    var registroparticipantes = null;
    var estatusGrupos = null;
    var registrogrupos = null;
    var admin = null;
    var staff = null;
    if(this.props.user.isRegistered) {
      if(this.props.user.currentRally != null && this.props.user.currentRally.rol !== 'PARTICIPANTE') {
        // Usuario es admin o staff
        staff = (
          <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, marginTop: 10, borderColor: 'gray', paddingHorizontal: 10, height: 35 }}>
            <Text style={{ color: 'gray', fontSize: 13, fontWeight: '400' }}>Staff</Text>
          </View>);

        selected = false;
        if(this.props.navigation.pantalla === 'ESTATUS') {
          selected = true;
        }
        estatusGrupos = (
          <SideMenuItem titulo="Estatus Equipos" icon={require('image!icon_status')} selected={selected} action={() => {this.props.closeMenu(); this.props.toEstatus();}}/>
        );

        if(this.props.user.currentRally.rol === 'ADMIN'){
          admin = (
            <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, marginTop: 10, borderColor: 'gray', paddingHorizontal: 10, height: 35 }}>
              <Text style={{ color: 'gray', fontSize: 13, fontWeight: '400' }}>Admin</Text>
            </View>);

          selected = false;
          if(this.props.navigation.pantalla === 'registrousuarios') {
            selected = true;
          }
          var registroparticipantes = (
            <SideMenuItem titulo="Registro de Participantes" icon={require('image!icon_rparticipante')} selected={selected} action={() => {this.props.closeMenu(); this.props.toPantallaRegistroUsr();}}/>
          );

          selected = false;
          if(this.props.navigation.pantalla === 'registrogrupos') {
            selected = true;
          }
          var registrogrupos = (
            <SideMenuItem titulo="Registro de Equipos" icon={require('image!icon_rgrupos')} selected={selected} action={() => {this.props.closeMenu(); this.props.toPantallaRegistroGrp();}}/>
          );
        }
      }



      var cerrar = null;
      cerrar = (<SideMenuItem titulo="Cerrar sesión" icon={require('image!icon_logout')}
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
            <Text style={{ color: 'white', marginTop: 5, fontSize: 11 }}>
              Rally {this.props.user.currentRally.grupo.rally.nombre}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ paddingRight: 10, color: 'white', fontSize: 11 }}>
                {this.props.user.currentRally.grupo.nombre}
              </Text>
              <Text style={{ color: 'white', fontSize: 11 }}>
                Talla playera: {this.props.user.userData.tallaPlayera}
              </Text>
            </View>
          </View>
        );
      }
      var pictureUri = this.props.user.fbData.picture.data.url;
      pictureUri = 'https://graph.facebook.com/v2.6/' + this.props.user.fbData.id + '/picture?height=200&access_token=' + this.props.user.token;
      userinfo = (
        <View
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: 'rgb(140,51,204)', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: pictureUri }}
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
        <ScrollView style={{ marginVertical: 10 }}>
          {noticias}
          {rally}
          {staff}
          {estatusGrupos}
          {admin}
          {registroparticipantes}
          {registrogrupos}
          <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, marginTop: 10, borderColor: 'gray', paddingHorizontal: 10, height: 35 }}>
            <Text style={{ color: 'gray', fontSize: 13, fontWeight: '400' }}>Información</Text>
          </View>
          {contacto}
          {cerrar}
        </ScrollView>
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
