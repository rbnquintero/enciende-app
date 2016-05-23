import React, {
  Component,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

var Header = require('../../../js/common/Header');
var Header = require('../../../js/common/Header');
var Actividad = require('../../../js/common/ActividadSegment');
var Loader = require('../../helpers/Loader');
var env = require('../../../env');
var MapView = require('react-native-maps');


/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');
var MapView = require('react-native-maps');


var { width, height } = Dimensions.get('window');

/* REDUX */
import type {State as User} from '../../../reducers/user';
import type {State as Navigation} from '../../../reducers/navigation';
var { connect } = require('react-redux');
var {
  toMainHome,
} = require('../../../actions');
type Props = {
  user: User;
  navigation: Navigation;
  toMainHome: () => void;
};

class EstatusGrupo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actividadesCargadas: false,
      actividades:null
    };
  }
  componentDidMount() {
    this.cargarActividades();
  }
  cargarActividades() {
    var query = env.serverURL + '/rally/actividades/'+this.props.grupoId+"/";

    fetch(query, { method: 'GET'
    }).then(response => response.json())
      .then(json => {
        this.setState({actividadesCargadas:true,actividades:json.actividades});
        this.cargarUbicaciones();
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true,isRegistering:false,isLoading: false,exito:false,
          messegeError:'Error al grabar el grupo, intenta más tarde'
        });
      });
  }
  toFloat(str){
    return parseFloat(str);
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
  cargarUbicaciones() {
    var query = env.serverURL + '/location/lista/'+this.props.grupoId;

    fetch(query, { method: 'GET'
    }).then(response => response.json())
      .then(json => {
        var locations =[];
        if(json.success && json.locations.length>0){
          for(i=0;(i<200);i++){
            locations.push({latitude:parseFloat(json.locations[i].latitud),longitude:parseFloat(json.locations[i].longitud)});
          }
        }
        var locationsNoEmpezadas=[];
        if(locations.length>0){
          locationsNoEmpezadas.push({
            latitude:locations[locations.length-1].latitude,
            longitude:locations[locations.length-1].longitude
          });
        }
        for(i=0;i<this.state.actividades.length;i++){
          if(this.state.actividades[i].estatus===0){
            console.log(this.state.actividades[i].actividad.latitud);
            console.log(this.state.actividades[i].actividad.longitudad);
            locationsNoEmpezadas.push({latitude:parseFloat(this.state.actividades[i].actividad.latitud),longitude:parseFloat(this.state.actividades[i].actividad.longitudad)});
          }
        }
        this.setState({locationsCargadas:true,locations:locations,locationsNoEmpezadas:locationsNoEmpezadas});
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true,isRegistering:false,isLoading: false,exito:false,
          messegeError:'Error al grabar el grupo, intenta más tarde'
        });
      });
  }
  render() {
    var _this = this;
    if(!this.state.actividadesCargadas) {
      view = (<Loader caption="Cargando actividades..."/>);
    }else{
      view =(
        <View>
          {this.state.actividades.map(function(result, id){
            return (
                <Actividad key={id} actividad={result}/>
            );
          })}
        </View>
      );
    }
    var locationsView;
    if(!this.state.locationsCargadas){
      locationsView = (<Loader caption="Cargando ubicaciones..."/>);
    }else{
      locationsView =(
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
            coordinates={this.state.locations}
            strokeColor="rgba(63, 191, 63,0.8)"
            strokeWidth={3}
            lineDashPattern={[5, 2, 3, 2]}
          />
          <MapView.Polyline
            coordinates={this.state.locationsNoEmpezadas}
            strokeColor="rgba(191, 63, 63,0.8)"
            strokeWidth={3}
            lineDashPattern={[5, 2, 3, 2]}
          />
          {this.state.actividades.map(function(result, id){
            return (
              <MapView.Marker
                key={'marker'+id}
                pinColor={_this.getPinColor(result)}
                coordinate={{
                  latitude: _this.toFloat(result.actividad.latitud),
                  longitude: _this.toFloat(result.actividad.longitudad),
                  animateDrop: true,
                  draggable: false,
                }}
                title={result.actividad.nombre}
              />
            );
          })}

        </MapView>
      );
    }


    return (
      <View style={{ flex: 1 }}>
        <Header
          title={'Grupo '+this.props.grupo.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../../../js/common/BackButtonIcon'),
            onPress: this.props.navigator.pop,
          }}/>

        <ScrollView >
          {view}
        </ScrollView>

          {locationsView}

      </View>
    );
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

function select(store) {
  return {
    user: store.user,
    navigation: store.navigation,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
  };
}



module.exports = connect(select, actions)(EstatusGrupo);
