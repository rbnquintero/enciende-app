import React, {
  Component,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView,
  View
} from 'react-native';

var Header = require('../../js/common/Header');
var ActividadDetalleLocked = require('../../js/common/ActividadDetalleLocked');
var ActividadDetalleCalificacion = require('../../js/common/ActividadDetalleCalificacion');
var ActividadDetalleInstrucciones = require('../../js/common/ActividadDetalleInstrucciones');
var ActividadDetalleComoLlegar = require('../../js/common/ActividadDetalleComoLlegar');
var ActividadDetallePista = require('../../js/common/ActividadDetallePista');
var ActividadDetalleMapa = require('../../js/common/ActividadDetalleMapa');

/* REDUX */
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
var {
  toMainHome,
  fetchActUser,
  loadActUser
} = require('../../actions');
var { connect } = require('react-redux');
type Props = {
  actividadesUser: ActividadesUser;
  refreshUserActividades: () => void;
};

class ActividadDetalle extends Component {

  render() {
    var sentActividad = this.props.actividad;
    var actividad = null;
    for (let a of this.props.actividadesUser.actividades) {
      if(a.id.idActividad === sentActividad.id.idActividad && a.id.idGrupo === sentActividad.id.idGrupo) {
        actividad = a;
      }
    }

    var contenido = null;
    if (actividad.estatus === 0) {
      contenido = (
        <ActividadDetalleLocked/>
      );
    } else {
      contenido = (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 2, marginHorizontal: 15 }}
            refreshControl={
              <RefreshControl
                refreshing={this.props.actividadesUser.isFetching}
                onRefresh={this.props.loadUserActividades}
                tintColor='rgb(140,51,204)'
                progressBackgroundColor="#ffff00"
              />
            }>
            <ActividadDetalleCalificacion actividad={actividad}/>
            <ActividadDetalleInstrucciones actividad={actividad}/>
            <ActividadDetalleComoLlegar actividad={actividad}/>
            <ActividadDetallePista actividad={actividad}/>
          </ScrollView>
          <ActividadDetalleMapa actividad={actividad}/>
        </View>
      );
    }

    return (
      <View style={{ flex: 1}}>
        <Header
          title={actividad.actividad.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Back',
            icon: require('../../js/common/img/back_white.png'),
            onPress: this.props.navigator.pop,
          }}/>
        <View style={{ flex: 1 }}>
          {contenido}
        </View>
      </View>
    );
  }
}

function select(store) {
  return {
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

module.exports = connect(select,actions)(ActividadDetalle);
