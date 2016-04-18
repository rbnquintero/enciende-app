import React, {
  Component,
  TouchableHighlight,
  Text,
  Image,
  StyleSheet,
  Alert,
  View
} from 'react-native';

var moment = require('moment');
var esLocale = require('moment/locale/es');

class Perfil extends Component {
  constructor(props){
    super(props);
    console.log(this.props.navBar);
    this.state = {
      localDBUtil : this.props.navBar.state.localDBUtil,
      myuser : this.props.navBar.state.myuser,
    };
  }

  _cerrarSesion() {
    console.log(this);
    this.props.navBar.setState({myuser: null});
    this.state.localDBUtil.deleteAll();
    this.props.navigator.pop();
  }

  render() {
    if(this.state.myuser != null) {
      return (
        <View style={{ flex: 1, marginTop: 64 }}>
          <View style={{ flex: 1, alignItems: 'center', overflow: 'hidden',  }}>
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', }}>
              <Image source={{ uri: this.state.myuser.fbData.picture.data.url }} style={{ resizeMode: Image.resizeMode.contain, width: 200, height: 150 }}/>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
              {this.state.myuser.userData.nombre}
            </Text>
            <Text style={{ fontWeight: '600', marginVertical: 5, color: 'gray' }}>
              {this.state.myuser.currentRally.grupo.rally.nombre}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ paddingRight: 30, fontWeight: '600', marginVertical: 5, color: 'gray' }}>
                {this.state.myuser.currentRally.grupo.nombre}
              </Text>
              <Text style={{ fontWeight: '600', marginVertical: 5, color: 'gray' }}>
                Talla camiseta: {this.state.myuser.userData.tallaPlayera}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'stretch', marginTop: 10, marginHorizontal: 30 }}>
            <View style={{ borderTopWidth: 2, }}>
              <Text style={{ fontWeight:'bold', marginTop: 10 }}>Próximos eventos</Text>
              {this.state.myuser.userData.grupoUsuarios.map(function(result, id){
                var fecha = new Date(result.grupo.rally.fechaInicio);
                var fechaStr = moment(fecha).locale("es", esLocale).format('LL');
                return (
                  <View key={id} style={{flexDirection: 'row', marginVertical: 10}}>
                    <Text style={{textAlign: 'left', flex: 1}}>{result.grupo.rally.nombre}</Text>
                    <Text style={{textAlign: 'right', flex: 1}}>{fechaStr}</Text>
                  </View>
                );
              })}
            </View>
            <View style={{ borderTopWidth: 2 }}>
              <Text style={{ fontWeight:'bold', marginVertical: 10 }}>Agregar otro evento</Text>
            </View>
            <View style={{ borderTopWidth: 2 }}>
              <Text style={{ fontWeight:'bold', marginVertical: 10 }}>Selecciona evento</Text>
            </View>
            <TouchableHighlight style={styles.wrapper}
              onPress={() => Alert.alert(
                'Cerrar sesión',
                '¿Estas seguro de cerrar sesión?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'OK', onPress: () => {this._cerrarSesion()}},
                ]
              )}>
              <View style={{ borderTopWidth: 2, borderBottomWidth: 2 }}>
                <Text style={{ fontWeight:'bold', marginVertical: 10 }}>Cerrar sesión</Text>
              </View>
            </TouchableHighlight>
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

module.exports = Perfil;
