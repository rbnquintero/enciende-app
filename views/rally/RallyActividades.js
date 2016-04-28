import React, {
  Component,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  View
} from 'react-native';

var Header = require('../../js/common/Header');
var Actividad = require('../../js/common/ActividadSegment');
var Loader = require('../helpers/Loader');
var ActividadDetalle = require('./ActividadDetalle');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
var { connect } = require('react-redux');
var {
  toMainHome,
  fetchActUser,
  loadActUser
} = require('../../actions');
type Props = {
  user: User;
  actividadesUser: ActividadesUser;
  toMainHome: () => void;
  loadUserActividades: () => void;
  refreshUserActividades: () => void;
};

class RallyActividades extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.props.loadUserActividades();
  }

  toActividadDetalle(actividad) {
    this.props.navigator.push({
      title: "Actividad Detalle",
      name: 'Actividad Detalle',
      component: ActividadDetalle,
      passProps: {actividad: actividad}
    });
  }

  render() {
    var _this = this;
    var actividades = (
      <Loader />
    );
    if(this.props.actividadesUser.actividades.length > 0) {
      actividades = (
        <ScrollView>
          {this.props.actividadesUser.actividades.map(function(result, id){
            return (
              <TouchableOpacity key={id} onPress={() => _this.toActividadDetalle(result)}>
                <Actividad actividad={result}/>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      );
    } else if (!this.props.actividadesUser.isFetching) {
      actividades = (
        <Text style={{ textAlign: 'center' }}>
          No se encontraron actividades
        </Text>
      );
    }

    return (
      <View style={{ flex: 1}}>
        <Header
          title={this.props.user.currentRally.grupo.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../../js/common/BackButtonIcon'),
            onPress: this.props.toMainHome,
          }}/>
        <View style={{ flex: 1 }}>
          {actividades}
        </View>
      </View>
    );
  }
}

function select(store) {
  return {
    user: store.user,
    actividadesUser: store.actividadesUser,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
    loadUserActividades: () => dispatch(loadActUser()),
    refreshUserActividades: () => dispatch(fetchActUser()),
  };
}

module.exports = connect(select, actions)(RallyActividades);
