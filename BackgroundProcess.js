var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

import React, {
  Component,
  NetInfo,
  Platform,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

/*  DATE */
var moment = require('moment');
var env = require('./env');
var preciseDiff = require('moment-precise-range-plugin');
var esLocale = require('moment/locale/es');

var localRepository = require('./views/utils/localRepository');

/* REDUX */
import type {State as User} from './reducers/user';
import type {State as App} from './reducers/app';
var { loadEventEmiter, startRally, endRally, rallyNotStarted, } = require('./actions');
var { connect } = require('react-redux');
var RNFS = require('react-native-fs');
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
    this.setUploadFilesTimer();
    this.setDateTimer();
  }

  setUploadFilesTimer(){
    var _this = this;
    setTimeout(function(){
      if(_this.state.update){
        if(_this.props.user.isLoggedIn && _this.props.user.currentRally != null){
          _this.uploadFiles();
        }
        _this.setUploadFilesTimer();
      }
    }, 30000);
  }

  setDateTimer(){
    var _this = this;
    setTimeout(function(){
      if(_this.state.update){
        if(_this.props.user.isLoggedIn && _this.props.user.currentRally != null){
          _this.refreshDate();
        }
        _this.setDateTimer();
      }
    }, 1000);
  }

  uploadFiles(){
    NetInfo.fetch().done((reach) => {
      console.log(reach);
      console.log(RNFS.DocumentDirectoryPath);
      //Subir fotos solo por wifi
      if("WIFI"==reach||"wifi"==reach){
        console.log("Hay internet por wifi, buscar selfies");
        var selfies = localRepository.getSelfiesASubir().then((selfies) => {
          if(selfies!=null&&selfies.length>0){

            var selfie = selfies[0];
            console.log("Selfie encontrada");
            console.log(selfie);
            if(selfie.estatus=='sin-subir'){
              console.log("Se va a subir selfie "+selfie.imageUri);
              selfie.estatus='subiendo';
              localRepository.saveSelfiesASubir(selfies);
              var photo = {
              	uri: selfie.imageUri,
              	type: 'image/jpeg',
              	name: 'abc.jpg',
              };

              var body = new FormData();
              body.append('photo', photo);
              body.append('idGrupo',selfie.actividad.id.idGrupo);
              body.append('idActividad',selfie.actividad.id.idActividad);
              body.append('token',selfie.token);
              body.append('title', 'A beautiful photo!');

              fetch(env.serverURL+'/rally/subir-selfie',{
                method: 'post',
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                body: body
                }).then(response => {
                  if(response.ok){
                    var selfies = localRepository.getSelfiesASubir().then((selfies) => {
                      var selfie = selfies.shift();
                      localRepository.saveSelfiesASubir(selfies);
                      if(Platform.OS === 'ios'){
                        var uri=selfie.imageUri.replace('file://', '');
                        console.log("Archivo a borrar: "+uri);
                        RNFS.unlink(uri)
                          .spread((success, path) => {console.log('Archivo borrado con exito');})
                          .catch((err) => {console.log(err.message);});
                      }
                    });
                    console.log("image uploaded");
                  }else{
                    console.log("Error al subir la imagen");
                    var selfies = localRepository.getSelfiesASubir().then((selfies) => {
                      if(selfies!=null&&selfies.length>0){
                        selfies[0].estatus='sin-subir';
                        localRepository.saveSelfiesASubir(selfies);
                      }
                    });
                  }
                }).catch(err =>{
                  console.log("Error al subir la imagen 2");
                  var selfies = localRepository.getSelfiesASubir().then((selfies) => {
                    if(selfies!=null&&selfies.length>0){
                      selfies[0].estatus='sin-subir';
                      localRepository.saveSelfiesASubir(selfies);
                    }
                  });
                  console.log(err);
                });
            }
          }else{
            console.log("No se encontraron selfies");
          }
        });
      }else{
        console.log("No hay internet, no se buscan selfies a subir");
      }
    });
  }

  refreshDate() {
    var rally = this.props.user.currentRally.grupo.rally;
    var fecha = new Date(rally.fechaInicio);
    var now = moment();
    var fechaStr = moment(fecha).fromNow();

    var timerRally;
    if(now.isBefore(fecha)){
      //Aun no inicia rally, calcular cuanto falta

      timerRally = {
        iniciado : false,
        terminado : false,
        timer : moment.preciseDiff(now,fecha,true)
      };
    }else if(moment(fecha).add(12,'hours').isAfter(now)){
      //El rally está en progreso
      timerRally = {
        iniciado : true,
        terminado : false
      };
    }else{
      //El rally terminó
      timerRally = {
        iniciado : true,
        terminado : true
      };
    }
    this.props.app.eventEmitter.emit('changedate', { timerRally: timerRally });

    // Iniciar/terminar envio de locations
    if(moment(now).isAfter(fecha)) {
      if(moment().isBefore(moment(fecha).add(12, 'hours'))){
        if(!this.props.app.rallyOn){
          var finaldate = moment(fecha).add(12, 'hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          this.props.startRally(this.props.user.currentRally.grupo.idGrupo, this.props.user.userData.idUsuario, finaldate);
        }
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
