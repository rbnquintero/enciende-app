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

class ActividadDetallePista extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desbloqCode: '',
    };
  }

  submitCode() {
    console.log(this.state.desbloqCode);
  }

  render() {
    if (this.props.actividad.estatus === '1') {
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
    if(this.props.actividad.horaDesbloqueada == null) {
      desbloq = (
        <View style={ styles.desbloqueoContainer }>
          <View style={ styles.desbloqueoInputContainer }>
            <TextInput placeholder='Código'
              value={this.state.desbloqCode}
              onChange={ (event) => this.setState({ desbloqCode: event.nativeEvent.text}) }
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
    backgroundColor: 'white', paddingHorizontal: 5, marginRight: 10, backgroundColor: 'white', borderRadius: 5,
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

module.exports = ActividadDetallePista;
