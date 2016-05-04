import React, {
  Component,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View
} from 'react-native';

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
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Header style={styles.header}
          title={ 'Rally ' + this.props.user.currentRally.grupo.rally.nombre}
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.navigator.props.openDrawer,
          }}/>
        <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 15 }}>
          <AppLogo/>
        </View>
        <View style={{ flex: 2, alignItems: 'center', marginHorizontal: 15 }}>
          <Text style={{ marginTop: 25, fontSize: 25, fontWeight: '200', textAlign: 'center' }}>
            El Rally {rally.nombre} comienza {fechaStr}
          </Text>
          <Text style={{ marginTop: 25, fontSize: 17, fontWeight: '200', textAlign: 'center' }}>
            Lorem ipsum dolor sit amet, maiores ornare ac fermentum, imperdiet ut vivamus a, nam lectus at nunc.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    /*android: {
      backgroundColor: '#5597B8',
    },*/
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

module.exports = connect(select, actions)(RallyHome);
