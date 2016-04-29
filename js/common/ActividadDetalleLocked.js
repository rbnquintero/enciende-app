import React, {
  Component,
  Text,
  Image,
  StyleSheet,
  View
} from 'react-native';

class ActividadDetalleLocked extends Component {

  render() {
    return (
      <View style={[ styles.container, { flexDirection: 'row' }]}>
        <View style={ styles.container }>
          <Image
            style={ styles.imagen }
            source={require('../../js/common/img/lock.png')}/>
          <Text style={ styles.texto }>
            Aún no has desbloqueado esta actividad
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center',
  },
  imagen: {
    resizeMode: Image.resizeMode.contain, width: 30, height: 30,
  },
  texto: {
    flex: 1, textAlign: 'center', color: 'gray', fontWeight: '200', fontSize: 17, marginTop: 20,
  },
});

module.exports = ActividadDetalleLocked;
