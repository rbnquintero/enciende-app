import React, {
  Component,
  TouchableOpacity,
  Image,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');
var FitImage = require('../../js/common/FitImage');

var AppLogo = require('../segments/AppLogo');
var Header = require('../../js/common/Header');

/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as App} from '../../reducers/app';
var { connect } = require('react-redux');
var {
  toMainHome,
} = require('../../actions');
type Props = {
  user: User;
  app: App;
  toMainHome: () => void;
};

class RallyHome extends Component {
  constructor(props) {
    super(props);
    var rally = this.props.user.currentRally.grupo.rally;
    var fecha = new Date(rally.fechaInicio);
    var fechaStr = moment(fecha).fromNow();
    this.state = {
      fecha: fechaStr,
      subscription : null,
    }
  }

  componentDidMount() {
    var _this = this;
    if (_this.props.app.eventEmitter != null) {
      _this.state.subscription = _this.props.app.eventEmitter.addListener('changedate', (args) => {
        _this.setState({timerRally: args.timerRally});
      });
    }
  }

  componentWillUnmount() {
    if(this.state.subscription != null) {
      this.state.subscription.remove();
    }
  }
  addCero(numero){
    if(numero<10){
      return '0'+numero;
    }else{
      return ''+numero;
    }
  }
  render() {
    var rally = this.props.user.currentRally.grupo.rally;
    var rallyTexto = '';
    var timerRally = this.state.timerRally;
    if(timerRally){
      if(!timerRally.iniciado){
        rallyTexto = 'Iniciamos en '+
          this.addCero(timerRally.timer.days) + ':' +
          this.addCero(timerRally.timer.hours) + ':' +
          this.addCero(timerRally.timer.minutes) + ':' +
          this.addCero(timerRally.timer.seconds);
      }else if(!timerRally.terminado){
        rallyTexto = 'Rally ' + rally.nombre + ' en progreso';
      }else{
        rallyTexto = 'Rally ' + rally.nombre + ' ha terminado';
      }
    }
    return (
      <View style={ styles.container }>
        <FitImage source={ require('image!going') }
          style={ styles.mainContainer } content={
          <View style={ styles.textContainerContainer }>
            <View style={ styles.textContainer }>
              <Text style={ styles.subtitulo }>
                ¡Prepárate para el Rally {rally.nombre}!
              </Text>
              <Text style={ styles.texto }>
                {rallyTexto}
              </Text>
            </View>
          </View>
        }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, flexWrap: 'wrap', alignSelf: 'stretch', overflow: 'hidden', },
  container: {
    flex: 1, flexWrap: 'wrap', flexDirection: 'row', alignSelf: 'stretch', },
  textContainerContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  textContainer: {
    flex: 1, alignItems: 'stretch', marginHorizontal: 15 },
  titulo: {
    flex: 1, fontSize: 25, textAlign: 'center', color: 'white' },
  subtitulo: {
    flex: 1, fontSize: 20, textAlign: 'center', color: 'white', marginTop: 10 },
  texto: {
    flex: 1, fontSize: 17, textAlign: 'center', color: 'white', marginTop: 18},
});

function select(store) {
  return {
    user: store.user,
    app: store.app,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
  };
}

module.exports = connect(select, actions)(RallyHome);
