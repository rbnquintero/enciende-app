import React, {
  Component,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';

/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');

/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
type Props = {
  user: User;
};

class RallyBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var rally = this.props.user.currentRally.grupo.rally;
    var fecha = new Date(rally.fechaInicio);
    var fechaStr = moment(fecha).locale("es", esLocale).endOf('hour').fromNow();

    return (
      <View style={styles.timercontainer}>
        <View style={styles.timercontainerContainer}>
          <Text style={styles.timercontainerText}>{rally.nombre} {fechaStr}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timercontainer: {
    backgroundColor: '#404040',
    height: 25,
    alignItems: 'center',
  },
  timercontainerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  timercontainerText: {
    color: 'white',
    fontWeight: '100',
    fontSize: 17,
    fontFamily: 'Helvetica',
    textAlign: 'center',
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(RallyBar);
