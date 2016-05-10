import React, {
  Component,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

var Loader = require('../../views/helpers/LoaderSmall');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
import type {State as Staff} from '../../reducers/staff';
var { connect } = require('react-redux');
var {
  validateActivity,
} = require('../../actions');
type Props = {
  user: User;
  actividadesUser: ActividadesUser;
  staff: Staff;
  validateActivity: () => void;
};

class ActividadDetalleSelfie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desbloqCode: '',
      calificacion: '',
    };
  }

  submitCode() {
    var info = {};
    info['actividades']=this.props.actividadesUser.actividades;
    info['staff']=this.props.staff.staff;
    info['action']='selfie';
    info['code']=this.state.desbloqCode;
    info['calificacion']=this.state.calificacion;
    this.props.validateActivity(info);
  }

  render() {
    if (this.props.actividad.estatus < 40) {
      return null;
    }

    var button = (
      <TouchableOpacity
        onPress={() => this.submitCode()}
        style={ styles.desbloqueoBotonContainer }>
        <View style={ styles.desbloqueoBotonTextoContainer }>
          <Text style={ styles.desbloqueoBotonTexto }>
            OK
          </Text>
        </View>
      </TouchableOpacity>
    );
    if (this.state.isLoading) {
      button = (
        <View style={ styles.desbloqueoBotonContainer }>
          <View style={ styles.desbloqueoBotonTextoContainer }>
            <Loader />
          </View>
        </View>
      );
    }

    var desbloq = null;
    if(this.props.actividad.estatus == 40) {
      desbloq = (
        <View style={ styles.desbloqueoContainer }>
          <View style={ styles.desbloqueoInputContainer }>
            <TextInput placeholder='Código'
              value={this.state.desbloqCode}
              onChange={ (event) => this.setState({ desbloqCode: event.nativeEvent.text}) }
              autoCapitalize='characters'
              style={ styles.desbloqueoInput }/>
          </View>
          <View style={ styles.desbloqueoInputContainer }>
            <TextInput placeholder='Calificación'
              value={this.state.calificacion}
              onChange={ (event) => this.setState({ calificacion: event.nativeEvent.text}) }
              autoCapitalize='characters'
              style={ styles.desbloqueoInput }/>
          </View>
          {button}
        </View>
      );
    }

    return (
      <View>
        <Text style={ styles.titulo }>
          Selfie
        </Text>
        <Text style={ styles.texto }>
          Toma tu selfie
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
    flex: 1, color: 'gray', fontWeight: '200', fontSize: 17, marginTop: 5,
  },
  desbloqueoContainer: {
    flexDirection: 'row', flexWrap: 'wrap', marginVertical: 30,
  },
  desbloqueoInputContainer: {
    backgroundColor: 'white', paddingHorizontal: 5, marginRight: 10, backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: '#e6e6e6'
  },
  desbloqueoInput: {
    height: 30, width: 80,
  },
  desbloqueoBotonContainer: {
    height: 30,
  },
  desbloqueoBotonTextoContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
  },
  desbloqueoBotonTexto: {
    flex: 1, fontSize: 18, fontWeight: '200', color: '#3399ff',
  }
});

function select(store) {
  return {
    user: store.user,
    actividadesUser: store.actividadesUser,
    staff: store.staff,
  };
}

function actions(dispatch) {
  return {
    validateActivity: (info) => dispatch(validateActivity(info)),
  };
}

module.exports = connect(select, actions)(ActividadDetalleSelfie);