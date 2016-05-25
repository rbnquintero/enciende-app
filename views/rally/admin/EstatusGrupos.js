import React, {
  Component,
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
      grupos:null
    };
  }

  componentDidMount() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    var query = env.serverURL + '/rally/'+this.props.user.currentRally.grupo.rally.idRally+'/getUltimaActividadByGrupo';

    fetch(query, { method: 'GET'
    }).then(response => response.json())
      .then(json => {
        this.setState({gruposCargados:true,actividades:json.actividades});
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true,isRegistering:false,isLoading: false,exito:false,
          messegeError:'Error al grabar el equipo, intenta más tarde'
        });
      });
  }
  render() {

    if(!this.state.gruposCargados) {
      view = (<Loader caption="Cargando equipos..."/>);
    }else{
      var _this = this;
      view =(
        <ScrollView>
          {this.state.actividades.map(function(result, id){
            return (
              <View key={id}>
                <TouchableHighlight  onPress={() => _this._pressRow(result)}>
                    <View style={styles.row}>
                      <Text style={styles.text}>
                        {'Equipo: '+result.grupo.nombre}
                      </Text>
                      <Text style={styles.text}>
                        {' Actvidad '+result.orden+': '+result.actividad.nombre+". Estatus: "+_this.getNombreEstatus(result.estatus)}
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
