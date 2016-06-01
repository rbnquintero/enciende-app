var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

import React, {
  Component,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');

/* REDUX */
import type {State as User} from './reducers/user';
import type {State as App} from './reducers/app';
var { loadEventEmiter, startRally, endRally, rallyNotStarted, } = require('./actions');
var { connect } = require('react-redux');
type Props = {
  user: User;
  app: App;
  loadEventEmiter: () => void;
  startRally: () => void;
  endRally: () => void;
  rallyNotStarted: () => void;
};

class BackgroundProcess extends Component {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      update: true,
      startCheck: false,
    };
  }

  componentWillMount() {
    var eventEmitter = new EventEmitter();
    this.props.loadEventEmiter(eventEmitter)
  }

  componentDidMount() {
    this.backgroundProcess();
  }

  componentWillUnmount() {
    this.state.update = false;
  }

  backgroundProcess() {
    var _this = this;
    setTimeout(function(){
      if(_this.state.update){
        if(_this.props.user.isLoggedIn && _this.props.user.currentRally != null){
          _this.refreshDate();
        }
        _this.backgroundProcess();
      }
    }, 1000);
  }

  refreshDate() {
    var rally = this.props.user.currentRally.grupo.rally;
    var fecha = new Date(rally.fechaInicio);
    var now = moment();
    var fechaStr = moment(fecha).fromNow();
    this.props.app.eventEmitter.emit('changedate', { fecha: fechaStr });
    if(moment(now).isAfter(fecha)) {
      if(moment().isBefore(moment(fecha).add(12, 'hours'))){
        var finaldate = moment(fecha).add(12, 'hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        this.props.startRally(this.props.user.currentRally.grupo.idGrupo, this.props.user.userData.idUsuario, finaldate);
      } else if(this.props.app.rallyOn || !this.state.startCheck) {
        this.state.startCheck = true;
        this.props.endRally();
      }
    } else if(!this.state.startCheck) {
      this.state.startCheck = true;
      this.props.rallyNotStarted();
    }
  }

  render() {
    return null;
  }
}

function select(store) {
  return {
    user: store.user,
    app: store.app,
  };
}

function actions(dispatch) {
  return {
    loadEventEmiter: (emiter) => dispatch(loadEventEmiter(emiter)),
    startRally: (grupo, userId, finaldate) => dispatch(startRally(grupo.toString(), userId.toString(), finaldate)),
    endRally: () => dispatch(endRally()),
    rallyNotStarted: () => dispatch(rallyNotStarted()),
  };
}

module.exports = connect(select, actions)(BackgroundProcess);
