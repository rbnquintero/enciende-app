import React, {
  Component,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
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
  logOut,toPantallaEnvioNotificaciones
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
  toPantallaEnvioNotificaciones: () => void;
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
    var envioNotificaciones = null;
    var admin = null;
    var staff = null;
    if(this.props.user.isRegistered) {
      if(this.props.user.currentRally != null && this.props.user.currentRally.rol !== 'PARTICIPANTE') {
        // Usuario es admin o staff
        staff = (
          <View style={ styles.seccionTextContainer }>
            <Text style={ styles.seccionText }>Staff</Text>
          </View>);

        selected = false;
        if(this.props.navigation.pantalla === 'estatus') {
          selected = true;
        }
        estatusGrupos = (
          <SideMenuItem titulo="Estatus Equipos" icon={require('image!icon_status')} selected={selected} action={() => {this.props.closeMenu(); this.props.toEstatus();}}/>
        );

        if(this.props.user.currentRally.rol === 'ADMIN'){
          admin = (
            <View style={ styles.seccionTextContainer }>
              <Text style={ styles.seccionText }>Admin</Text>
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

          selected = false;
          if(this.props.navigation.pantalla === 'envioNotificaciones') {
            selected = true;
          }
          var envioNotificaciones = (
            <SideMenuItem titulo="Envío de Notificaciones" icon={require('image!icon_rgrupos')} selected={selected} action={() => {this.props.closeMenu(); this.props.toPantallaEnvioNotificaciones();}}/>
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
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: 'rgb(29,30,37)' }}>
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
            <Text style={ styles.detailsText }>
              Rally {this.props.user.currentRally.grupo.rally.nombre}
            </Text>
            <Text style={ styles.detailsText }>
              Equipo: {this.props.user.currentRally.grupo.nombre}
            </Text>
            <Text style={ styles.detailsText }>
              Playera: {this.props.user.userData.tallaPlayera}
            </Text>
          </View>
        );
      }
      var pictureUri = this.props.user.fbData.picture.data.url;
      pictureUri = 'https://graph.facebook.com/v2.6/' + this.props.user.fbData.id + '/picture?height=200&access_token=' + this.props.user.token;
      userinfo = (
        <View
          style={{ paddingTop: STATUS_BAR_HEIGHT, height: 140, backgroundColor: 'rgb(29,30,37)', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: pictureUri }}
            style={ styles.profilePic }/>
            <View>
              <Text style={ styles.nameText }>{this.props.user.userData.nombre}</Text>
              {infoRally}
            </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(36,40,51)', }}>
        {userinfo}
        <ScrollView>
          {noticias}
          {rally}
          {staff}
          {estatusGrupos}
          {admin}
          {registroparticipantes}
          {registrogrupos}
          {envioNotificaciones}
          <View style={ styles.seccionTextContainer }>
            <Text style={ styles.seccionText }>Información</Text>
          </View>
          {contacto}
          {cerrar}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profilePic: {
    resizeMode: Image.resizeMode.contain, height: 60, width: 60, margin: 10, borderRadius: 30 },
  nameText: {
    color: 'rgb(240,242,245)', fontSize: 16, },
  detailsText: {
    color: 'rgb(156,158,162)', fontSize: 10 },
  seccionText: {
    color: 'rgb(156,158,162)', fontSize: 13, },
  seccionTextContainer: {
    flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: 'rgb(29,30,37)',paddingHorizontal: 10, height: 20 }
});

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
    toPantallaEnvioNotificaciones: () => dispatch(toPantallaEnvioNotificaciones()),
    logOut: () => dispatch(logOut()),
  };
}

module.exports = connect(select, actions)(SideMenu);
