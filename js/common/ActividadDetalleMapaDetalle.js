import React, {
  Component,
  TouchableOpacity,
  Text,
  Platform,
  Linking,
  View
} from 'react-native';

var ActividadDetalleMapa = require('./ActividadDetalleMapa');
var Header = require('./Header');

class ActividadDetalleMapaDetalle extends Component {
  openDirections() {
    console.log(this.props.actividad.actividad);
    var latitud = this.props.actividad.actividad.latitud;
    var longitud = this.props.actividad.actividad.longitudad;
    var platform = 'google';
    if(Platform.OS === 'ios') {
      platform = 'apple';
    }
    var directions = 'http://maps.' + platform + '.com/?daddr=' + latitud + ',' + longitud + '&dirflg=r&t=m'
    Linking.canOpenURL(directions).then(supported => {
      if (supported) {
        Linking.openURL(directions);
      } else {
        console.log('Don\'t know how to open URI: ' + directions);
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          title={this.props.actividad.actividad.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Back',
            icon: require('../../js/common/img/back_white.png'),
            onPress: this.props.navigator.pop,
          }}
          rightItem={{
            layout: 'default',
            title: 'IR',
            onPress: this.openDirections.bind(this),
          }}/>
        <ActividadDetalleMapa actividad={this.props.actividad}/>
      </View>
    );
  }
}

module.exports = ActividadDetalleMapaDetalle;
