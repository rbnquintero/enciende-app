import React, {
  Component,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');

var Loader = require('../helpers/Loader');
var env = require('../../env');

class RegistroUsuarioResultado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading : true,
      token: null,
      grupo: null,
    }
    this.registerUser();
  }

  cleanUser() {
    //TODO use redux
    var user = {
      nombre: '',
      email: '',
      tallaPlayera: '',
      generoFem: true,
      grupo: 1,
    };
    this.props.parent.setState({user: user});
  }

  registerUser() {
    var query = env.serverURL + '/rally/inscribir';
    query+='?nombre=' + this.props.userToRegister.nombre;
    query+='&email=' + this.props.userToRegister.correo;
    query+='&genero=' + this.props.userToRegister.genero;
    query+='&tallaPlayera=' + this.props.userToRegister.talla;
    query+='&grupoUsuarios[0].id.grupoIdGrupo=' + this.props.userToRegister.grupo;
    query+='&grupoUsuarios[0].rol=PARTICIPANTE';
    console.log(query);
    fetch(query, { method: 'POST'
    }).then(response => response.json())
      .then(json => {
        if(json.success == true) {
          this.setState({ isLoading: false, token: json.grupo.token, grupo: json.grupo.grupo.nombre });
          this.cleanUser();
        } else {
          console.log(json.error);
          this.setState({
            errorLoading: true
          });
        }
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true
        });
      });
  }

  render() {
    var view = null;
    if(this.state.isLoading){
      view = (<Loader caption="Registrando usuario"/>);
    } else {
      view = (
        <View style={{ flex: 1, margin: 5 }}>
          <Text style={{ fontSize: 25, fontWeight: '200', marginTop: 20, }}>
            Usuario registrado!</Text>
          <Text style={{ fontSize: 22, fontWeight: '400', marginTop: 20, }}>
            {this.props.userToRegister.nombre}</Text>
          <View style={{ flexDirection: 'row', marginTop: 20, }}>
            <Text style={{ flex: 1, fontSize: 17, fontWeight: '200', }}>
              Talla de playera</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 17, fontWeight: '200', }}>
              {this.props.userToRegister.talla}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5, }}>
            <Text style={{ flex: 1, fontSize: 17, fontWeight: '200', }}>
              Correo</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 17, fontWeight: '200', }}>
              {this.props.userToRegister.correo}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5, }}>
            <Text style={{ flex: 1, fontSize: 17, fontWeight: '200', }}>
              Grupo</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 17, fontWeight: '200', }}>
              {this.state.grupo}</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '600', marginTop: 20, textAlign: 'center'}}>
            {this.state.token}</Text>
          <Text style={{ fontSize: 17, fontWeight: '200', marginVertical: 20, }}>
            Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.</Text>
          <TouchableOpacity onPress={ () => this.props.appnavigator.pop() }>
            <Text style={{fontSize: 17, fontWeight: '200', textAlign: 'center', color: '#3399ff'}}>
              Regresar
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor:'black' }}>
        <View style={{ flex: 1, marginTop: 24, backgroundColor:'#e6e6e6', margin:10, borderRadius:15 }}>
          {view}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

module.exports = RegistroUsuarioResultado;
