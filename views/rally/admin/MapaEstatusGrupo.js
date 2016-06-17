import React, {
  BackAndroid,
  Component,
  Text,
  Image,
  Linking,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';

var Header = require('../../../js/common/Header');
var MapView = require('react-native-maps');

class MapaEstatusGrupo extends Component {
  constructor(props) {
    super(props);
    this.state={
      refrescar: true,
    };
    console.log(this);
  }

  componentDidMount() {
    this.refrescarProcess();
  }

  refrescarProcess() {
    var _this = this;
    setTimeout(function(){
      if(_this.state.refrescar && typeof _this.props.refrescar == 'function') {
        _this.props.refrescar();
        _this.refrescarProcess();
      }
    }, 5000);
  }

  componentWillUnmount() {
    this.state.refrescar = false;
  }

  render(){
    var _this = this;

    var header;

    if(this.props.navigator){
      header =(
        <Header
          title={'Ruta equipo '+this.props.grupo.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Back',
            icon: require('../../../js/common/img/back_white.png'),
            onPress: this.props.navigator.pop,
          }}
        />
      );
    }

    var locationsView =(
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.4236302,
          longitude: -99.1652748,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        <MapView.Polyline
          coordinates={this.props.locations}
          strokeColor="rgba(63, 191, 63,0.8)"
          strokeWidth={3}
          lineDashPattern={[5, 2, 3, 2]}
        />
        <MapView.Polyline
          coordinates={this.props.locationsNoEmpezadas}
          strokeColor="rgba(191, 63, 63,0.8)"
          strokeWidth={3}
          lineDashPattern={[5, 2, 3, 2]}
        />
        {this.props.actividades.map(function(result, id){
          return (
            <MapView.Marker
              key={'marker'+id}
              pinColor={_this.getPinColor(result)}
              coordinate={{
                latitude: parseFloat(result.actividad.latitud),
                longitude: parseFloat(result.actividad.longitudad),
                animateDrop: true,
                draggable: false,
              }}
              title={result.actividad.nombre}
              description={_this.getNombreEstatus(result.estatus)}
            />
          );
        })}

      </MapView>
    );

    return (
      <View style={{flex:1,flexDirection:'column'}}>
        {header}
        {locationsView}
      </View>
    );
  }
  getPinColor(actividadGrupo){
    if(actividadGrupo.estatus===0){
      return '#DC143C';
    }else if(actividadGrupo.estatus===100){
      return '#00FF00';
    }else{
      return '#1E90FF';
    }
  }
  getNombreEstatus(estatus){
     if(estatus===0){
       return 'Bloqueada';
     }else if(estatus===10){
       return 'Pista mostrada';
     }else if(estatus===20){
       return 'Como llegar mostrado';
     }else if(estatus===30){
       return 'Haciendo actvidad';
     }else if(estatus===40){
       return 'Selfie tomada';
     }else if(estatus===100){
       return 'Terminada';
     }
  }
}

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#ffffff',
    },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },
    thumb: {
      width: 64,
      height: 64,
    },
    text: {
      flex: 1,
    },
    map: {flex: 1}
});

module.exports = MapaEstatusGrupo;
