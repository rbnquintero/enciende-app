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
var Header = require('../../js/common/HeaderHome');

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

  handleChangeGrupo(input, event) {
    var grupo = this.state.grupo;
    grupo[input] = event.nativeEvent.text;
    this.setState({ grupo: grupo });
  }

  registraGrupo() {
    this.setState({ isLoading: true, isRegistering: false,});
    var query = env.serverURL + '/rally/grabarGrupos';
    query+='?nombre=' + this.state.grupo.nombre;
    query+='&rally.idRally=' + this.props.user.currentRally.grupo.rally.idRally;
    query+='&token=' + this.props.user.user.token;

    fetch(query, { method: 'POST'
    }).then(response => response.json())
      .then(json => {
        if(json.success == true) {
          this.setState({ isLoading: true, isRegistering: false, grupo: { nombre: ''}, });
          this.loadGrupos();
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
    if(this.state.isLoading) {
      view = (<Loader caption="Cargando grupos"/>);
    } else if (this.state.isRegistering) {
      view = (<Loader caption="Registrando grupo"/>);
    } else {
      view = (
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 25, fontWeight: '200', marginTop: 20, }}>
              Registro de Grupos
            </Text>
            <View style={{paddingHorizontal: 5, marginTop: 20, backgroundColor: 'white', borderRadius: 5, }}>
              <TextInput placeholder='Nombre del grupo' value={this.state.grupo.nombre} onChange={this.handleChangeGrupo.bind(this, 'nombre')} autoCapitalize='words'
                style={{height: 35}}/>
            </View>
            <TouchableOpacity style={{marginTop: 20}} onPress={() => this.registraGrupo()}>
              <View>
                <Text style={{fontSize: 17, textAlign: 'center', fontWeight: '200', color: '#3399ff'}}>
                  Registrar grupo
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 25, fontWeight: '200', marginVertical: 20, }}>
              Grupos registrados
            </Text>
            <ScrollView>
              {this.state.grupos.map(function(result, id){
                return (
                  <View key={id} style={{marginBottom: 7}}>
                    <Text style={{fontSize: 17, fontWeight: '200'}}>
                      {result.nombre}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <Header
          title="Registro de Grupos"
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.openDrawer,
          }}/>
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

module.exports = connect(select,actions)(RegistroGrupos);
