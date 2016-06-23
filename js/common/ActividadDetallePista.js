import React, {
  Component,
  Image,
  StyleSheet,
  LayoutAnimation,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
var {Text} = require('./Text');
var t = require('tcomb-form-native');
var dismissKeyboard = require('dismissKeyboard');

var Loader = require('../../views/helpers/LoaderSmall');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
import type {State as Staff} from '../../reducers/staff';
import type {State as App} from '../../reducers/app';
var { connect } = require('react-redux');
var {
  validateActivity,
} = require('../../actions');
type Props = {
  user: User;
  actividadesUser: ActividadesUser;
  staff: Staff;
  app: App;
  validateActivity: () => void;
};

class ActividadDetallePista extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      errorCode: null,
      loading: true,
    });
  }

  submitCode() {
    dismissKeyboard();
    this.state.errorCode = null;
    var form = this.refs.form.getValue();
    if(form != null) {
      var info = {};
      info['actividades']=this.props.actividadesUser.actividades;
      info['staff']=this.props.staff.staff;
      info['action']='pista';
      info['code']=form.codigo;
      this.props.validateActivity(info, (success, message) => {
        if (success) {
          console.log("Success!");
        } else {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          this.setState({errorCode: message, loading: false});
        }
      });
    }
  }

  focusInput() {
    //this.setState({errorCode: null});
  }

  render() {
    if (this.props.actividad.estatus === 0) {
      return null;
    }

    var Form = t.form.Form;
    var PistaForm = t.struct({
      codigo: t.String,
    });
    var formOptions = {
      fields:{
        codigo:{
          autoCapitalize: 'characters',
          placeholder: 'JK123',
          label: 'Código',
          error: 'Inserta un código válido',
          onFocus: this.focusInput.bind(this)
        }
      }
    };

    var button = (
      <TouchableOpacity style={styles.button} onPress={() => this.submitCode()} underlayColor='#99d9f4'>
        <Text style={[styles.font, styles.buttonText]}>Validar</Text>
      </TouchableOpacity>
    );
    if (this.props.actividadesUser.isPushing && this.props.actividad.estatus == 10) {
      button = (
        <View style={ styles.desbloqueoBotonContainer }>
          <View style={ styles.desbloqueoBotonTextoContainer }>
            <Loader />
          </View>
        </View>
      );
    }

    var error = null;
    if(this.state.errorCode != null) {
      error = (
        <Text style={{marginTop: -10, color: 'red'}}>{this.state.errorCode}</Text>
      );
    }

    var desbloq = null;
    var inst = null;
    if(this.props.actividad.estatus == 10 && this.props.app.rallyOn) {
      inst = (
        <Text style={ styles.textoInst }>
          Resuelve la siguiente pista y muéstrasela al staff:
        </Text>);
      desbloq = (
        <View style={ styles.desbloqueoContainer }>
          <Form
            ref="form"
            type={PistaForm}
            options={formOptions}
          />
          {error}
          {button}
        </View>
      );
    }

    return (
      <View>
        <Text style={ styles.titulo }>
          Pista
        </Text>
        {inst}
        <Text style={ styles.texto }>
          {this.props.actividad.actividad.pistaLugar}
        </Text>
        {desbloq}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titulo: {
    flex: 1, fontWeight: '200', fontSize: 25, marginTop: 15,
  },
  texto: {
    flex: 1, fontWeight: '200', fontSize: 17, marginTop: 5, textAlign: 'center'
  },
  textoInst: {
    flex: 1, color: 'gray', fontWeight: '200', fontSize: 13, marginTop: 5,
  },
  desbloqueoContainer: {
    flexWrap: 'wrap', marginVertical: 30,
  },
  desbloqueoInputContainer: {
    paddingHorizontal: 5, marginRight: 10
  },
  desbloqueoInput: {
    height: 35, borderColor:'#cccccc',borderWidth: 1,borderRadius: 4, padding:7,width:80
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
});

function select(store) {
  return {
    user: store.user,
    actividadesUser: store.actividadesUser,
    staff: store.staff,
    app: store.app,
  };
}

function actions(dispatch) {
  return {
    validateActivity: (info, callback) => dispatch(validateActivity(info, callback)),
  };
}

module.exports = connect(select, actions)(ActividadDetallePista);
