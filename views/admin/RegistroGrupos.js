import React, {
  Component,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Switch,
  Text,
  ScrollView,
  StyleSheet,
  Picker,
  View
} from 'react-native';

var Loader = require('../helpers/Loader');
var env = require('../../env');
var RegistroUsuarioResultado = require('./RegistroUsuarioResultado');
var ListaUsuariosPorEquipo = require('./ListaUsuariosPorEquipo');
var Header = require('../../js/common/HeaderHome');

import BackPress from '../../js/common/BackPress';

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
type Props = {
  user: User;
};

class RegistroGrupos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grupo: {
        nombre: '',
      },
      grupos: [],
      isLoading: true,
      isRegistering: false,
      errorLoading: false,
      messegeError: '',
      exito:false
    }

    this.loadGrupos();
  }
  componentDidMount() {
      this.backPress = new BackPress(this.navigator,this.props.drawer);
  }

  componentWillUnmount() {
    this.backPress.removeListener();
  }
  loadGrupos() {
    var rally = this.props.user.currentRally.grupo.rally;
    var query = env.serverURL + '/rally/' + rally.idRally + '/grupos';
    fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true) {
          this.setState({
            isLoading: false,
            grupos: json.grupos,
            errorLoading : false,
            messegeError:''
          });
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

  handleChangeGrupo(input, event) {
    var grupo = this.state.grupo;
    grupo[input] = event.nativeEvent.text;
    this.setState({ grupo: grupo });
  }

  registraGrupo() {
    if(this.state.grupo.nombre==''){
      this.setState({
        errorLoading: true,isRegistering:false,isLoading: false,
        messegeError:"El nombre del equipo es requerido",exito:false
      });
    }else{
      this.setState({ isLoading: true, isRegistering: false,});
      var query = env.serverURL + '/rally/grabarGrupos';
      query+='?nombre=' + this.state.grupo.nombre;
      query+='&rally.idRally=' + this.props.user.currentRally.grupo.rally.idRally;
      query+='&token=' + this.props.user.token;

      fetch(query, { method: 'POST'
      }).then(response => response.json())
        .then(json => {
          if(json.success == true) {
            this.setState({ isLoading: true, isRegistering: false,exito:true,
              errorLoading : false, grupo: { nombre: ''},messegeError:'' });
            this.loadGrupos();
          } else {
            console.log(json);
            this.setState({
              errorLoading: true,isRegistering:false,isLoading: false,
              messegeError:json.errorMessage,exito:false
            });
          }
        }).catch(error => {
          console.log(error);
          this.setState({
            errorLoading: true,isRegistering:false,isLoading: false,exito:false,
            messegeError:'Error al grabar el equipo, intenta más tarde'
          });
        });
      }
  }

  verGrupo(equipo) {
    this.props.navigator.push({
      title: "ListaUsuariosPorEquipo",
      name: 'ListaUsuariosPorEquipo',
      component: ListaUsuariosPorEquipo,
      passProps: {grupo: equipo}
    });
  }

  render() {

    console.log(this.props);
    var _this = this;
    var view = null;
    if(this.state.isLoading) {
      view = (<Loader caption="Cargando equipos"/>);
    } else if (this.state.isRegistering) {
      view = (<Loader caption="Registrando equipo"/>);
    } else {
      var textoError = null;
      var textoExito = null;
      if(this.state.errorLoading){
        textoError = (
          <Text style={[styles.font, { fontSize: 18, fontWeight: '200', marginTop: 20,  color:'red' }]}>
            {this.state.messegeError}
          </Text>
        )
      }
      if(this.state.exito && !this.state.errorLoading){
        textoExito = (
          <Text style={[styles.font, { fontSize: 18, fontWeight: '200', marginTop: 20,  color:'green' }]}>
            El equipo ha sido guardado
          </Text>
        )
      }
      view = (
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.font, { fontSize: 25, fontWeight: '200', marginTop: 20}]}>
              Registra los equipos al rally
            </Text>
            {textoError}
            {textoExito}
            <View style={{paddingHorizontal: 5, marginTop: 20, backgroundColor: 'white' }}>
              <TextInput placeholder='Nombre del equipo' value={this.state.grupo.nombre} onChange={this.handleChangeGrupo.bind(this, 'nombre')} autoCapitalize='words'
                style={{height: 35, borderColor:'#cccccc',borderWidth: 1,borderRadius: 4, padding:7}}/>
            </View>
            <TouchableHighlight style={styles.button} onPress={() => this.registraGrupo()} underlayColor='#99d9f4'>
              <Text style={[styles.font, styles.buttonText]}>Registrar equipo</Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.font, { fontSize: 25, fontWeight: '200', marginVertical: 20 }]}>
              Equipos registrados
            </Text>
            <ScrollView>
              {this.state.grupos.map(function(result, id){
                return (
                  <TouchableOpacity key={id} onPress={() => _this.verGrupo(result)}>
                    <View style={{marginBottom: 7}}>
                      <Text style={[styles.font, {fontSize: 17, fontWeight: '200'}]}>
                        {result.nombre}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Header
          title="Registro de Equipos"
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.navigator.props.openDrawer,
          }}/>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  font: {
    fontFamily: 'Source Sans Pro',
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {

  };
}

module.exports = connect(select,actions)(RegistroGrupos);
