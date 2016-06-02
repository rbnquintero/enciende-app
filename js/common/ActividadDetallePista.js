import React, {
  Component,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
var {Text} = require('./Text');

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

class ActividadDetallePista extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desbloqCode: '',
    };
  }

  submitCode() {
    var info = {};
    info['actividades']=this.props.actividadesUser.actividades;
    info['staff']=this.props.staff.staff;
    info['action']='pista';
    info['code']=this.state.desbloqCode;
    this.props.validateActivity(info);
  }

  render() {
    if (this.props.actividad.estatus === 0) {
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
    if (this.props.actividadesUser.isPushing && this.props.actividad.estatus == 10) {
      button = (
        <View style={ styles.desbloqueoBotonContainer }>
          <View style={ styles.desbloqueoBotonTextoContainer }>
            <Loader />
          </View>
        </View>
      );
    }

    var desbloq = null;
    if(this.props.actividad.estatus == 10) {
      desbloq = (
        <View style={ styles.desbloqueoContainer }>
          <View style={ styles.desbloqueoInputContainer }>
            <TextInput placeholder='Código'
              value={this.state.desbloqCode}
              onChange={ (event) => this.setState({ desbloqCode: event.nativeEvent.text}) }
              autoCapitalize='characters' underlineColorAndroid='rgba(0,0,0,0)'
              style={ styles.desbloqueoInput }/>
          </View>
          {button}
        </View>
      );
    }

    return (
      <View>
        <Text style={ styles.titulo }>
          Pista
        </Text>
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
    flex: 1, color: 'gray', fontWeight: '200', fontSize: 17, marginTop: 5,
  },
  desbloqueoContainer: {
    flexDirection: 'row', flexWrap: 'wrap', marginVertical: 30,
  },
  desbloqueoInputContainer: {
    paddingHorizontal: 5, marginRight: 10
  },
  desbloqueoInput: {
    height: 35, borderColor:'#cccccc',borderWidth: 1,borderRadius: 4, padding:7,width:80
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

module.exports = connect(select, actions)(ActividadDetallePista);
