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
import type {State as Navigation} from '../../reducers/navigation';
var { connect } = require('react-redux');
var {
  toMainHome,
} = require('../../actions');
type Props = {
  user: User;
  navigation: Navigation;
  toMainHome: () => void;
};

class RallyHome extends Component {

  render() {
    var rally = this.props.user.currentRally.grupo.rally;
    var fecha = new Date(rally.fechaInicio);
    var fechaStr = moment(fecha).locale("es", esLocale).endOf('hour').fromNow();

    return (
      <View style={ styles.mainContainer}>
        <Header
          title={ 'Rally ' + this.props.user.currentRally.grupo.rally.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.navigator.props.openDrawer,
          }}/>
        <View style={ styles.container }>
          <FitImage source={ require('image!going') }
            style={ styles.mainContainer } content={
            <View style={ styles.textContainerContainer }>
              <View style={ styles.textContainer }>
                <Text style={ styles.subtitulo }>
                  ¡Prepárate para el Rally Enciende de este año!
                </Text>
                <Text style={ styles.texto }>
                  El rally {rally.nombre} comienza {fechaStr}
                </Text>
              </View>
            </View>
          }/>
        </View>
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
    navigation: store.navigation,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
  };
}

module.exports = connect(select, actions)(RallyHome);
