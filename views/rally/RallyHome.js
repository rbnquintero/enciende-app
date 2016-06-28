import React, {
  Component,
  TouchableOpacity,
  Image,
  ScrollView,
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
                Gracias por ser parte del Rally {rally.nombre}!
              </Text>
              <Text style={ [styles.texto, {fontSize: 18, fontWeight: 'bold'} ] }>
                {rallyTexto}
              </Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 15 }}>
              <ScrollView style={{ flex: 1, marginTop: 18 }}>
                <Text style={ [styles.info, {marginTop: 10}] }>
                  Ya estamos a pocos días del evento y hay varias cosas que queremos contarte. Por favor, lee con atención:
                </Text>
                <Text style={ [styles.texto, { fontWeight: 'bold'} ] }>
                  Indicaciones generales
                </Text>
                <Text style={ styles.info }>
                  El Rally comenzará a las 8:00am. ¡Llega temprano! Si llegas tarde no te enterarás de todas las instrucciones.
                </Text>
                <Text style={ styles.info }>
                  Viste con ropa cómoda, ya que viajarás en el metro por varios puntos de la ciudad. Puedes usar ropa deportiva o jeans, tenis y gorra. Te daremos una playera.
                </Text>
                <Text style={ styles.info }>
                  Te recomendamos llevar una mochila ligera, impermeable por si llueve, una botella de agua y alguna barrita energética o fruta. Tú decides.
                </Text>
                <Text style={ styles.info }>
                  ¡No te olvides de llegar desayunado! Correrás mucho.
                </Text>
                <Text style={ [styles.texto, { fontWeight: 'bold'} ] }>
                  App enciende
                </Text>
                <Text style={ styles.info }>
                  Este año desarrollamos una aplicación móvil especial para el Rally. ¡Así las rutas serán más fáciles de seguir y las actividades más fáciles de compartir!
                </Text>
                <Text style={ styles.info }>
                  El día del rally procura ir con la batería del cel completamente llena. Si tienes una batería externa, llévala.
                </Text>
                <Text style={ styles.info }>
                  Procura que por lo menos alguien de tu equipo cuente con datos de Internet para compartir las fotos. No te preocupes, no se consumirá mucho. No es necesario que todo el equipo instale la app, pero pueden hacerlo. Con que una o dos personas la lleven activa TODO EL RECORRIDO será suficiente.
                </Text>
                <Text style={ [styles.texto, { fontWeight: 'bold'} ] }>
                  Actividad especial
                </Text>
                <Text style={ styles.info }>
                  Lleva dinero en efectivo o en tarjeta (como sea más cómodo), lo invertirás en una buena causa. Piensa en que la actividad podría requerir de 100 a 200 pesos aproximadamente por equipo.
                </Text>
                <Text style={ [styles.info, {marginTop: 8}] }>
                  Más allá de correr, el Rally es para compartir a otros del amor de Dios y de las cosas que puede hacer en nuestras vidas. Tómate tu tiempo para cumplir adecuadamente las actividades.
                </Text>
                <Text style={ styles.info }>
                  ¡Compartamos el amor de Dios con la mejor actitud!
                </Text>
                <Text style={ [styles.info, { fontWeight: 'bold'} ] }>
                  ¡Nos vemos el sábado!  ¡Oremos juntos por el Rally!
                </Text>
              </ScrollView>
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
    flex:1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  textContainer: {
    alignItems: 'center', marginHorizontal: 15 },
  titulo: {
    flex: 1, fontSize: 25, textAlign: 'center', color: 'white' },
  subtitulo: {
    flex: 1, fontSize: 20, textAlign: 'center', color: 'white', marginTop: 10 },
  texto: {
    flex: 1, fontSize: 17, textAlign: 'center', color: 'white', marginTop: 18},
  info: {
    flex: 1, fontSize: 13, textAlign: 'left', color: 'white', marginBottom: 10},
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
