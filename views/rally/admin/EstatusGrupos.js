import React, {
  Component,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

var Header = require('../../../js/common/Header');
var Loader = require('../../helpers/Loader');
var env = require('../../../env');
var EstatusGrupo = require('./EstatusGrupo');

/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');

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

class EstatusGrupos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gruposCargados: false,
      grupos:null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    if(this.state.actividades =! null) {
      this.setState({
        errorLoading: false, refreshing: true,
      });
    }

    var query = env.serverURL + '/rally/'+this.props.user.currentRally.grupo.rally.idRally+'/getUltimaActividadByGrupo';
    console.log(query);
    env.timeout(20000,
    fetch(query, { method: 'GET'})
      .then(response => response.json())
      .then(json => {
        this.setState({gruposCargados:true,actividades:json.actividades, errorLoading: false, refreshing: false});
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true, refreshing: false,
          messegeError:'Error al grabar el equipo, intenta más tarde'
        });
      })).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true, refreshing: false,
          messegeError:'Error al grabar el equipo, intenta más tarde'
        });
      });
  }

  render() {
    if(!this.state.gruposCargados && !this.state.errorLoading) {
      view = (<Loader caption="Cargando equipos..."/>);
    } else if (this.state.errorLoading) {
      view = (
        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1}} onPress={() => {
            this.cargarGrupos();
          }} >
            <View style={{flex:1, alignItems: 'center'}}>
              <Text style={{ textAlign: 'center', flex: 1 }}>Ocurrió un error al cargar los grupos.</Text>
              <Text style={{ textAlign: 'center', flex: 1 }}>Haz click aquí para reintentar.</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }else{
      var _this = this;
      view =(
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.cargarGrupos.bind(this)}
              tintColor='rgba(255,255,255,0.7)'
            />
          }>
          {this.state.actividades.map(function(result, id){
            return (
              <View key={id}>
                <TouchableHighlight  onPress={() => _this._pressRow(result)}>
                    <View style={styles.row}>
                      <Text style={styles.text}>
                        {'Equipo: '+result.grupo.nombre}
                      </Text>
                      <Text style={styles.text}>
                        {' Actvidad '+result.orden+': '+result.actividad.nombre}
                      </Text>
                      <Text style={styles.text}>
                        {" Estatus: "+_this.getNombreEstatus(result.estatus)}
                      </Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.separator} />
              </View>
            );
          })}
        </ScrollView>
      );
    }


    return (
      <View style={{ flex: 1 }}>
        <Header
          title="Estatus Equipos"
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../../js/common/img/hamburger.png'),
            onPress: this.props.navigator.props.openDrawer,
          }}/>
        <View style={{ flex: 1 }}>
          {view}
        </View>
      </View>
    );
  }
  _pressRow(actividad) {
    console.log(actividad);
    this.props.navigator.push({
      title: "Detalle Equipo",
      name: 'EstatusGrupo',
      component: EstatusGrupo,
      passProps: {grupoId: actividad.id.idGrupo,grupo: actividad.grupo}
    });
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
      //flexDirection: 'row',
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



module.exports = connect(select, actions)(EstatusGrupos);
