import React, {
  Component,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
  ScrollView,
  StyleSheet,
  Picker,
  View
} from 'react-native';

var Loader = require('../helpers/Loader');
var env = require('../../env');
var RegistroUsuarioResultado = require('./RegistroUsuarioResultado');

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
type Props = {
  user: User;
};

class RegistroUsuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        nombre: '',
        email: '',
        tallaPlayera: '',
        generoFem: true,
        grupo: 1,
      },
      grupos: {},
      isLoading: true,
    }
    this.loadGrupos();
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

  handleChangeUser(input, event) {
    var user = this.state.user;
    user[input] = event.nativeEvent.text;
    this.setState({ user: user });
  }

  handleChangeGender(event) {
    var user = this.state.user;
    user.generoFem = event.nativeEvent.value;
    this.setState({ user: user });
  }

  handleChangeGroup(value) {
    var user = this.state.user;
    user.grupo = value;
    this.setState({ user: user });
  }

  toRegisterUserPOST() {
    this.props.navigator.push({
      title: "RegistroUsuarioResultado",
      name: 'RegistroUsuarioResultado',
      component: RegistroUsuarioResultado,
      fromBottom: true,
      //TODO use redux
      passProps: { userToRegister: this.state.user, parent: this},
    });
  }

  render() {
    var view = null;
    if(this.state.isLoading){
      view = (<Loader caption="Cargando grupos"/>);
    } else {
      view = (
      <ScrollView>
        <Text style={{ fontSize: 25, fontWeight: '200', marginTop: 20, }}>
          Registro de Participantes
        </Text>
        <View style={{backgroundColor: 'white', paddingHorizontal: 5, marginTop: 20, backgroundColor: 'white', borderRadius: 5, }}>
          <TextInput placeholder='Nombre' value={this.state.user.nombre} onChange={this.handleChangeUser.bind(this, 'nombre')} autoCapitalize='words'
            style={{height: 35}}/>
        </View>
        <View style={{backgroundColor: 'white', paddingHorizontal: 5, marginTop: 20, backgroundColor: 'white', borderRadius: 5, }}>
          <TextInput placeholder='Correo' value={this.state.user.email} onChange={this.handleChangeUser.bind(this, 'email')}
            style={{height: 35}} keyboardType='email-address' autoCapitalize='none'/>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
          <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 5, backgroundColor: 'white', borderRadius: 5, }}>
            <TextInput placeholder='Talla de playera' value={this.state.user.tallaPlayera} onChange={this.handleChangeUser.bind(this, 'tallaPlayera')}
              style={{height: 35}}/>
          </View>
          <View style={{flex: 2, alignItems: 'flex-end'}}>
            <View style={{height: 35, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 17, fontWeight: '200', marginHorizontal:5}}>Hombre</Text>
              <Switch value={this.state.user.generoFem} onChange={this.handleChangeGender.bind(this)}/>
              <Text style={{fontSize: 17, fontWeight: '200', marginHorizontal:5}}>Mujer</Text>
            </View>
          </View>
        </View>
        <View style={{paddingHorizontal: 5, marginTop: 20}}>
          <Picker selectedValue={this.state.user.grupo} onValueChange={this.handleChangeGroup.bind(this)}>
            {this.state.grupos.map(function(result, id){
              var nombreGrupo = 'Grupo ' + result.nombre;
              return (
                <Picker.Item key={id} label={nombreGrupo} value={result.idGrupo} />
              );
            })}
          </Picker>
        </View>
        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.toRegisterUserPOST()}>
          <View>
            <Text style={{fontSize: 17, fontWeight: '200', textAlign: 'center', color: '#3399ff'}}>
              Registrar participante
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>);
    }

    return (
      <View style={{ flex: 1, marginTop: 64, marginHorizontal: 20 }}>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {

  };
}

module.exports = connect(select,actions)(RegistroUsuarios);
