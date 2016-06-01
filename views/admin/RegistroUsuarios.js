import React, {
  Component,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Switch,
  ScrollView,
  StyleSheet,
  Picker,
  Text,
  View
} from 'react-native';

var Loader = require('../helpers/Loader');
var env = require('../../env');
var RegistroUsuarioResultado = require('./RegistroUsuarioResultado');
var Header = require('../../js/common/HeaderHome');
var t = require('tcomb-form-native');


import BackPress from '../../js/common/BackPress';
import AccordionPicker from '../../js/component/AccordionPicker';


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
        token: this.props.user.token,
      },
      grupos: {},
      isLoading: true,
    }
    this.loadGrupos();
  }

  componentDidMount() {
      this.backPress = new BackPress(this.props.appnavigator,this.props.drawer);
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
    var value = this.refs.form.getValue();
    if (value) {
      this.props.appnavigator.push({
        title: "RegistroUsuarioResultado",
        name: 'RegistroUsuarioResultado',
        component: RegistroUsuarioResultado,
        fromBottom: true,
        //TODO use redux
        passProps: { userToRegister: value, parent: this}
      });
      console.log(value); // value here is an instance of Person
    }
  }

  render() {
    console.log(Genero);
    var view = null;
    if(this.state.isLoading){
      view = (<Loader caption="Cargando grupos"/>);
    } else {

      var Form = t.form.Form;

      var Talla = t.enums({
        C: 'Chica',
        M: 'Mediana',
        G: 'Grande',
        XG:'Extra Grande'
      });

      var Genero = t.enums({
        H: 'Hombre',
        M: 'Mujer'
      });
      var gruposMap = {};


      for(var i=0;i<this.state.grupos.length;i++){
        gruposMap[this.state.grupos[i].idGrupo]=this.state.grupos[i].nombre;
      }
      var Grupo = t.enums(gruposMap);
      var formOptions;
      if(Platform.OS === 'ios'){
        formOptions = {
          fields:{
            nombre:{
              autoCapitalize: 'words'
            },
            correo:{
              keyboardType: 'email-address',
              autoCapitalize: 'none'
            },
            genero:{
              template: (data) => (
                  <AccordionPicker
                      defaultValue={data.options.find((o) => o.value === data.value)}
                      onChange={data.onChange}
                      options={data.options}
                      data={data}
                  />
              )
            },
            talla:{
              template: (data) => (
                  <AccordionPicker
                      defaultValue={data.options.find((o) => o.value === data.value)}
                      onChange={data.onChange}
                      options={data.options}
                      data={data}
                  />
              )
            },
            grupo:{
              template: (data) => (
                  <AccordionPicker
                      defaultValue={data.options.find((o) => o.value === data.value)}
                      onChange={data.onChange}
                      options={data.options}
                      data={data}
                  />
              )
            }
          }
        };
      }else{
        formOptions = {
          fields:{
            nombre:{
              autoCapitalize: 'words'
            },
            correo:{
              keyboardType: 'email-address'
            }
          }
        };
      }

      // here we are: define your domain model
      var Registro = t.struct({
        nombre: t.String,              // a required string
        correo: t.String,  // an optional string
        talla: Talla,               // a required number
        genero: Genero  ,
        grupo: Grupo      // a boolean
      });

      console.log(this.state.grupos);

      view = (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 17, fontWeight: '200', marginTop: 20, }}>
            Ingresa los datos del participante
          </Text>
        </View>
        <View style={styles.container}>
          <Form
            ref="form"
            type={Registro}
            options={formOptions}
          />
          <TouchableHighlight style={styles.button} onPress={() => this.toRegisterUserPOST()} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Registrar participante</Text>
          </TouchableHighlight>
        </View>

      </ScrollView>);
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <Header
          title="Registro de Participantes"
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
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
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop:10
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

module.exports = connect(select,actions)(RegistroUsuarios);
