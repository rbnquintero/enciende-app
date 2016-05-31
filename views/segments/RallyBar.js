import React, {
  Component,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  View
} from 'react-native';

/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as App} from '../../reducers/app';
var { connect } = require('react-redux');
type Props = {
  user: User;
  app: App;
};

class RallyBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fechaStr : null,
      subscription : null,
      viewStyle : {
        bottom: -35
      },
    };
  }

  componentDidMount() {
    _this = this;
    if (_this.props.app.eventEmitter != null) {
      _this.state.subscription = _this.props.app.eventEmitter.addListener('changedate', (args) => {
        if(_this.state.timerRally == null) {
          _this.appear();
        }
        _this.setState({timerRally: args.timerRally});
      });
    }
  }

  appear() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({viewStyle: {bottom: 0}});
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
      <View style={[styles.timercontainer, this.state.viewStyle]}>
        <View style={styles.timercontainerContainer}>
          <Text style={styles.timercontainerText}>{rallyTexto} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timercontainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 35,
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
    textAlign: 'center',
  }
});

function select(store) {
  return {
    user: store.user,
    app: store.app,
  };
}

module.exports = connect(select)(RallyBar);
