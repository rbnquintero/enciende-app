import React, {
  Component,
  TouchableOpacity,
  Image,
  ScrollView,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');
var Header = require('../../js/common/HeaderHome');
var Loader = require('../helpers/Loader');
var env = require('../../env');

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
type Props = {
  user: User;
};

class ListaUsuariosPorEquipo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      integrantes: null,
      errorLoading: false,
    };
  }

  componentDidMount() {
    this.refreshIntegrantes();
  }

  refreshIntegrantes() {
    this.setState({refreshing: true, errorLoading: false});

    var rally = this.props.grupo.rally.idRally;
    var grupo = this.props.grupo.idGrupo;
    var query = env.serverURL + '/rally/' + rally + '/grupos/' + grupo + '/integrantes/' + this.props.user.userData.grupoUsuarios[0].token;
    env.timeout(null, fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true) {
          this.setState({
            refreshing: false,
            integrantes: json.grupos,
            errorLoading : false,
          });
        } else {
          console.log(json.error);
          this.setState({
            errorLoading: true
          });
        }
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true
        });
      })).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true
        });
      });
  }

  render() {
    var _this = this;
    var view = (<Loader caption="Cargando integrantes"/>);
    if(this.state.integrantes != null) {
      view = (
        <ScrollView>
          {this.state.integrantes.map(function(result, id){
            var imageSource = require('image!profile');
            if(result.idFacebook != null) {
              imageSource = {uri: 'https://graph.facebook.com/v2.6/' + result.idFacebook + '/picture?height=200&access_token=' + _this.props.user.token};
            } else if (result.genero === 'M') {
              imageSource = require('image!profilem');
            }
            return (
              <View key={id} style={{marginVertical: 5, marginHorizontal: 10, flexDirection:'row', alignItems: 'center'}}>
                <Image source={imageSource} style={{width: 50, height: 50, marginRight: 10}}/>
                <View>
                  <Text style={{fontSize: 19}}>{result.nombre}</Text>
                  <Text style={{fontSize: 12, color: 'gray'}}>Talla: {result.tallaPlayera}</Text>
                  <Text style={{fontSize: 12, color: 'gray'}}>Correo: {result.email}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          title={"Integrantes equipo " + this.props.grupo.nombre}
          leftItem={{
            layout: 'icon',
            itle: 'Close',
            icon: require('../../js/common/BackButtonIcon'),
            onPress: this.props.navigator.pop,
          }}/>
        {view}
      </View>
    );
  }
}

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(ListaUsuariosPorEquipo);
