import React, {
  Component,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
  ScrollView,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');
var dismissKeyboard = require('dismissKeyboard');

var Header = require('../../js/common/Header');
var ActividadDetalleLocked = require('../../js/common/ActividadDetalleLocked');
var ActividadDetalleCalificacion = require('../../js/common/ActividadDetalleCalificacion');
var ActividadDetalleInstrucciones = require('../../js/common/ActividadDetalleInstrucciones');
var ActividadDetalleComoLlegar = require('../../js/common/ActividadDetalleComoLlegar');
var ActividadDetallePista = require('../../js/common/ActividadDetallePista');
var ActividadDetalleMapa = require('../../js/common/ActividadDetalleMapa');
var ActividadDetalleMapaDetalle = require('../../js/common/ActividadDetalleMapaDetalle');

/* REDUX */
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
import type {State as User} from '../../reducers/user';
var {
  toMainHome,
  fetchActUser,
  loadActUser
} = require('../../actions');
var { connect } = require('react-redux');
type Props = {
  actividadesUser: ActividadesUser;
  refreshUserActividades: () => void;
};

class ActividadDetalle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
    };
  }
  refresh() {
    this.props.loadUserActividades(this.props.user.currentRally.grupo.idGrupo);
  }

  componentDidMount() {
    var _this = this;
    setTimeout(function(){
      _this.setState({map: (
        <ActividadDetalleMapa actividad={_this.props.actividad}/>
      )});
    }, 400);
  }

  toMapaDetalle() {
    this.props.navigator.push({
      title: "Mapa Detalle",
      name: 'Mapa Detalle',
      component: ActividadDetalleMapaDetalle,
      passProps: {actividad: this.props.actividad}
    });
  }

  render() {
    var sentActividad = this.props.actividad;
    var actividad = null;
    for (let a of this.props.actividadesUser.actividades) {
      if(a.id.idActividad === sentActividad.id.idActividad && a.id.idGrupo === sentActividad.id.idGrupo) {
        actividad = a;
      }
    }

    var mapa = null;
    if(this.props.actividad.estatus > 10) {
      mapa = (
        <TouchableWithoutFeedback style={{flex: 1}} onPress={this.toMapaDetalle.bind(this)}>
          <View style={{flex: 1}}/>
        </TouchableWithoutFeedback>
      );
    }

    var contenido = null;
    if (actividad.estatus === 0) {
      contenido = (
        <ActividadDetalleLocked/>
      );
    } else {
      contenido = (
        <View style={{ flex: 1 }}>
          <View style={{flex: 4}}/>
          {this.state.map}
          <View style={{left: 0, right: 0, top: 0, bottom: 0, position: 'absolute'}}>
            <ScrollView style={{ flex: 4, marginHorizontal: 15 }}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.actividadesUser.isFetching}
                  onRefresh={this.refresh.bind(this)}
                  tintColor='rgb(140,51,204)'
                  progressBackgroundColor="#ffff00"
                />
              }>
              <ActividadDetalleCalificacion actividad={actividad}/>
              <ActividadDetalleInstrucciones actividad={actividad}/>
              <ActividadDetalleComoLlegar actividad={actividad}/>
              <ActividadDetallePista actividad={actividad}/>
            </ScrollView>
            {mapa}
          </View>
        </View>
      );
    }

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
          {contenido}
        </View>
      </View>
    );
  }
}

function select(store) {
  return {
    actividadesUser: store.actividadesUser,
    user: store.user,
  };
}
function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
    loadUserActividades: (grupoId) => dispatch(loadActUser(grupoId)),
    refreshUserActividades: (actividades, grupoId) => dispatch(fetchActUser(actividades, grupoId)),
  };
}

module.exports = connect(select,actions)(ActividadDetalle);
