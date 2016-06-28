import React, {
  Component,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  View
} from 'react-native';
var {Text} = require('./Text');
var t = require('tcomb-form-native');
var dismissKeyboard = require('dismissKeyboard');
var _ = require('lodash');

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

class ActividadDetalleCalificacion extends Component {
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
      info['action']='selfie';
      info['code']=form.codigo;
      info['calificacion']=form.calificacion;
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
    if (this.props.actividad.estatus < 40) {
      return null;
    }

    var Form = t.form.Form;
    var PistaForm = t.struct({
      codigo: t.String,
      calificacion: t.String,
    });
    const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
    stylesheet.textbox.normal.color = 'rgb(240,242,245)';
    stylesheet.textbox.error.color = 'rgb(240,242,245)';
    stylesheet.controlLabel.normal.color = 'rgb(240,242,245)';
    stylesheet.controlLabel.normal.fontSize = 17;
    stylesheet.controlLabel.error.color = 'rgb(240,242,245)';
    stylesheet.controlLabel.error.fontSize = 17;
    stylesheet.errorBlock.color = 'rgb(240,242,245)';
    stylesheet.errorBlock.fontSize = 13;
    var formOptions = {
      fields:{
        codigo:{
          autoCapitalize: 'characters',
          placeholder: 'JK123',
          label: 'Código',
          error: 'Inserta un código válido',
          stylesheet: stylesheet,
          onFocus: this.focusInput.bind(this)
        },
        calificacion:{
          keyboardType: 'numeric',
          autoCapitalize: 'characters',
          placeholder: '87',
          label: 'Calificación',
          error: 'Inserta una calificación válida',
          stylesheet: stylesheet,
          onFocus: this.focusInput.bind(this)
        }
      }
    };

    var button = (
      <TouchableOpacity style={styles.button} onPress={() => this.submitCode()} underlayColor='#99d9f4'>
        <Text style={[styles.font, styles.buttonText]}>Validar</Text>
      </TouchableOpacity>
    );
    if (this.props.actividadesUser.isPushing && this.props.actividad.estatus == 40) {
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
    var calif = null;
    if(this.props.actividad.estatus == 40 && this.props.app.rallyOn) {
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
    } else if(this.props.actividad.estatus == 100) {
      calif = (
        <View style={ styles.calificacionContainer }>
          <Text style={ styles.calificacion }>
            {this.props.actividad.calificacion}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={ styles.titulo }>
            Calificación
          </Text>
          {calif}
        </View>
        {desbloq}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titulo: {
    flex: 1, fontSize: 17, marginTop: 10, color: 'rgb(240,242,245)',
  },
  texto: {
    flex: 1, fontSize: 15, marginTop: 5, textAlign: 'center', color: 'rgb(156,158,162)',
  },
  calificacionContainer: {
    alignItems: 'center', height: 80, width: 80, backgroundColor: 'rgb(29,30,37)', marginTop: 15, borderWidth: 2, borderColor: 'yellow', borderRadius: 5, marginBottom: 40
  },
  calificacion: {
    color: 'white', fontSize: 40, paddingTop: 10, textAlign: 'center', alignSelf: 'center',
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

module.exports = connect(select, actions)(ActividadDetalleCalificacion);
