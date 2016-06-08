import React, {
  BackAndroid,
  Component,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';

var Header = require('../../../js/common/Header');
var Actividad = require('../../../js/common/ActividadSegment');
var Loader = require('../../helpers/Loader');
var env = require('../../../env');
var MapView = require('react-native-maps');
var MapaEstatusGrupo = require('./MapaEstatusGrupo');


/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');



import LinearGradient from 'react-native-linear-gradient';
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
      actividades:null,
      refreshing:false,
    };
  }

  componentDidMount() {
    this.cargarActividades();
  }

  refrescar(){
    this.setState({refreshing: true});
    this.cargarActividades();
  }

  cargarActividades() {
    var query = env.serverURL + '/rally/actividades/'+this.props.grupoId+"/";

    fetch(query, { method: 'GET'
    }).then(response => response.json())
      .then(json => {
        this.setState({actividadesCargadas:true,actividades:json.actividades, refreshing: false});
        this.cargarUbicaciones();
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true,isRegistering:false,isLoading: false,exito:false, refreshing: false,
          messegeError:'Error al grabar el equipo, intenta más tarde'
        });
      });
  }
  cargarUbicaciones() {
    var query = env.serverURL + '/location/lista/'+this.props.grupoId+'/100';

    fetch(query, { method: 'GET'
    }).then(response => response.json())
      .then(json => {
        var locations =[];
        if(json.success && json.locations.length>0){
          for(i=0;i<json.locations.length;i++){
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
          if(this.state.actividades[i].estatus!=0 && this.state.actividades[i].estatus!=100){
            console.log(this.state.actividades[i].actividad.latitud);
            console.log(this.state.actividades[i].actividad.longitudad);
            locationsNoEmpezadas.push({latitude:parseFloat(this.state.actividades[i].actividad.latitud),longitude:parseFloat(this.state.actividades[i].actividad.longitudad)});
          }
        }
        this.setState({locationsCargadas:true,locations:locations,locationsNoEmpezadas:locationsNoEmpezadas, refreshing: false});
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true,isRegistering:false,isLoading: false,exito:false,
          messegeError:'Error al grabar el equipo, intenta más tarde'
        });
      });
  }

  toMapaDetalle() {
    this.props.navigator.push({
      title: "Detalle de ruta",
      name: 'Detalle de ruta',
      component: MapaEstatusGrupo,
      passProps: {actividades: this.state.actividades,locations:this.state.locations,
        locationsNoEmpezadas:this.state.locationsNoEmpezadas,grupo:this.props.grupo,refrescar:()=>this.refrescar()}
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
        <MapaEstatusGrupo locations={this.state.locations}
          locationsNoEmpezadas={this.state.locationsNoEmpezadas}
          actividades={this.state.actividades}/>
        );
    }


    return (
      <LinearGradient
        locations={[0,1.0]}
        colors={['rgb(157,14,214)', 'rgb(136,72,250)',]}
        style={{ flex: 1,flexDirection: 'column'}}>
        <Header
          title={'Equipo '+this.props.grupo.nombre}
          style={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(255,255,255,0.15)', borderBottomWidth: 1 }}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../../../js/common/BackButtonIcon'),
            onPress: this.props.navigator.pop,
          }}/>
        <View style={{flex:1,flexDirection:'column'}}>
          <View style={{ flex: 1,flexDirection: 'column'}}>
            <View style={{flex: 4}}/>
            <View style={{flex:1}}>
              {locationsView}
            </View>
          </View>
          <View style={{left: 0, right: 0, top: 0, bottom: 0, position: 'absolute'}}>
            <ScrollView style={{flex:4}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.refrescar.bind(this)}
                  tintColor='rgb(140,51,204)'
                  progressBackgroundColor="#ffff00"
                />
              }>
              {view}
            </ScrollView>
            <TouchableWithoutFeedback style={{flex: 1}} onPress={this.toMapaDetalle.bind(this)}>
              <View style={{flex: 1}}/>
            </TouchableWithoutFeedback>
          </View>
        </View>

      </LinearGradient>
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
