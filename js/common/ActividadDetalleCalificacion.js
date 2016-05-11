import React, {
  Component,
  Text,
  Image,
  StyleSheet,
  View
} from 'react-native';

class ActividadDetalleCalificacion extends Component {

  render() {
    if (this.props.actividad.estatus != 100) {
      return null;
    }

    return (
      <View>
        <Text style={ styles.titulo }>
          ¡Completada!
        </Text>
        <Text style={ styles.texto }>
          Calificación: {this.props.actividad.calificacion}
        </Text>
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
});

module.exports = ActividadDetalleCalificacion;
