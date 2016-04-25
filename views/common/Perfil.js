import React, {
  Component,
  TouchableHighlight,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  View
} from 'react-native';

var moment = require('moment');
var esLocale = require('moment/locale/es');
var PerfilOption = require('../segments/PerfilOption');
var RegistroUsuarios = require('../admin/RegistroUsuarios');
var RegistroGrupos = require('../admin/RegistroGrupos');

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
var {
  fetchProfile,
  logOut,
} = require('../../actions');
type Props = {
  user: User;
  updateProfile: () => void;
  logOut: () => void;
};

class Perfil extends Component {
  constructor(props){
    super(props);
  }

  render() {
    var extraOptions = <View/>
    //TODO CAMBIAR para el staff / admin
    if(this.props.user.currentRally.rol === 'PARTICIPANTE') {
      // Usuario es admin
      extraOptions = (
        <View>
          <PerfilOption caption="Registro de participantes"
            onPress={() => {
              this.props.navigator.push({
                title: "Registro",
                name: 'Registro de participantes',
                component: RegistroUsuarios,
              });
            }}/>
          <PerfilOption caption="Registro de grupos"
            onPress={() => {
              this.props.navigator.push({
                title: "Registro",
                name: 'Registro de grupos',
                component: RegistroGrupos,
              });
            }}/>
        </View>
      );
    } else if(this.props.user.currentRally.rol === 'STAFF') {
      // Usuario es staff
    }

    if(this.props.user.isRegistered) {
      return (
        <View style={{ flex: 1, marginTop: 64 }}>
          <View style={{ flex: 1, alignItems: 'center', overflow: 'hidden',  }}>
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', }}>
              <Image source={{ uri: this.props.user.fbData.picture.data.url }} style={{ resizeMode: Image.resizeMode.contain, width: 200, height: 150 }}/>
            </View>
            <Text style={{ fontWeight: '200', fontSize: 25 }}>
              {this.props.user.userData.nombre}
            </Text>
            <Text style={{ fontWeight: '200', marginVertical: 5, color: 'gray' }}>
              {this.props.user.currentRally.grupo.rally.nombre}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ paddingRight: 30, fontWeight: '200', marginVertical: 5, color: 'gray' }}>
                {this.props.user.currentRally.grupo.nombre}
              </Text>
              <Text style={{ fontWeight: '200', marginVertical: 5, color: 'gray' }}>
                Talla camiseta: {this.props.user.userData.tallaPlayera}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'stretch', marginTop: 10, marginHorizontal: 30 }}>
            <ScrollView>
              <View style={{ borderTopWidth: 1, }}>
                <Text style={{ fontWeight:'200', marginTop: 10 }}>Próximos eventos</Text>
                {this.props.user.userData.grupoUsuarios.map(function(result, id){
                  var fecha = new Date(result.grupo.rally.fechaInicio);
                  var fechaStr = moment(fecha).locale("es", esLocale).format('LL');
                  return (
                    <View key={id} style={{flexDirection: 'row', marginVertical: 10}}>
                      <Text style={{textAlign: 'left', flex: 1, fontWeight:'200', color: 'gray'}}>{result.grupo.rally.nombre}</Text>
                      <Text style={{textAlign: 'right', flex: 1, fontWeight:'200', color: 'gray'}}>{fechaStr}</Text>
                    </View>
                  );
                })}
              </View>
              {extraOptions}
              <PerfilOption caption="Cambiar de evento"/>
              <TouchableHighlight style={styles.wrapper}
                onPress={() => Alert.alert(
                  'Cerrar sesión',
                  '¿Estas seguro de cerrar sesión?',
                  [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    {text: 'OK', onPress: () => {this.props.logOut(this.props.navigator)}},
                  ]
                )}>
                <View style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
                  <Text style={{ fontWeight:'200', marginVertical: 10 }}>Cerrar sesión</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({

});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    updateProfile: () => dispatch(fetchProfile()),
    logOut: (navigator)=> {dispatch(logOut()), navigator.pop();},
  };
}

module.exports = connect(select, actions)(Perfil);
