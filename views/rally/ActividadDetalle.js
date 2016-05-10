import React, {
  Component,
  TouchableOpacity,
  Text,
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

class ActividadDetalle extends Component {

  render() {
    var actividad = this.props.actividad;
    console.log(this.props.actividad.estatus === 0);
    var contenido = null;
    if (actividad.estatus === 0) {
      contenido = (
        <ActividadDetalleLocked/>
      );
    } else {
      contenido = (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 2, marginHorizontal: 15 }}>
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

module.exports = ActividadDetalle;
