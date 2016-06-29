import React, {
  Component,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  View
} from 'react-native';
var {Text} = require('./Text');

var MapView = require('react-native-maps');

class ActividadDetalleMapa extends Component {
  constructor(props){
    super(props);
  }

  render() {
    if (this.props.actividad.estatus < 20) {
      return null;
    }
    
    var lat = parseFloat(this.props.actividad.actividad.latitud);
    var lon = parseFloat(this.props.actividad.actividad.longitudad);

    return (
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <MapView.Marker
          coordinate={{
            latitude: lat,
            longitude: lon,
            animateDrop: true,
            draggable: false,
          }}
          title='{marker.title}'
          description='{marker.description}'
        />
      </MapView>
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
  map: {
    flex: 1
  },
});

module.exports = ActividadDetalleMapa;
