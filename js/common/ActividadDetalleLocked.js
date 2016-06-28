import React, {
  Component,
  Image,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('./Text');

class ActividadDetalleLocked extends Component {

  render() {
    return (
      <View style={[ styles.container, { flexDirection: 'row' }]}>
        <View style={ styles.container }>
          <Image
            style={ styles.imagen }
            source={require('image!actbloq')}/>
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
    resizeMode: Image.resizeMode.contain, width: 50, height: 50,
  },
  texto: {
    flex: 1, fontSize: 17, marginTop: 5, color: 'rgb(156,158,162)',
  },
});

module.exports = ActividadDetalleLocked;
