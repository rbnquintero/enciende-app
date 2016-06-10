import React, {
  Component,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

class ListaUsuariosPorEquipo extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={ () => this.props.navigator.pop() }>
          <Text>
            Lista de integrantes equipo {this.props.grupo.nombre}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = ListaUsuariosPorEquipo;
