import React, {
  Component,
  TouchableOpacity,
  Text,
  Image,
  View
} from 'react-native';

var Header = require('../../js/common/Header');

class ActividadDetalle extends Component {

  render() {
    console.log(this.props);
    var actividad = this.props.actividad;

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
          
        </View>
      </View>
    );
  }
}

module.exports = ActividadDetalle;
