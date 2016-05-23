'use strict'

var localRepository = require('../views/utils/localRepository');

var env = require('../env');
/*
 * action types
 */
const ACT_USER_LOADING = 'ACT_USER_LOADING';
const ACT_USER_LOADED = 'ACT_USER_LOADED';
const ACT_USER_LOADING_ERROR = 'ACT_USER_LOADING_ERROR';
const ACT_PUSHING = 'ACT_PUSHING';
const ACT_PUSHING_DONE = 'ACT_PUSHING_DONE';

/*
 * action creators
 */
function actUserLoading() {
  return {
    type: ACT_USER_LOADING,
  };
}

function actPushing() {
  return {
    type: ACT_PUSHING,
  };
}

function actPushingDone(actUser) {
  return {
    type: ACT_PUSHING_DONE,
    actUser: actUser,
  };
}

function actUserLoadingError(error) {
  return {
    type: ACT_USER_LOADING_ERROR,
    error: error,
  };
}

function actUserLoaded(actUser) {
  return {
    type: ACT_USER_LOADED,
    actUser: actUser,
  };
}

function loadActUser() {
  return function(dispatch) {
    dispatch(actUserLoading());
    return localRepository.getSavedActUser().then((actUser) => {
      if(actUser != null) {
        dispatch(actUserLoaded(actUser));
        dispatch(fetchActUser(actUser));
      } else {
        dispatch(fetchActUser());
      }
    });
  }
}

function fetchActUser(actividades) {
  return function(dispatch) {
    if(actividades != null) {
      var info = [];
      info['actividades'] = actividades;
      info['code'] = env.validtoken;
      dispatch(validateActivity(info));
    } else {
      dispatch(actUserLoading());
      var query = env.serverURL + '/rally/actividades/2/';
      return fetch(query)
        .then(response => response.json())
        .then(json => {
          if(json.success == true){
            localRepository.saveActUser(json.actividades);
            dispatch(actUserLoaded(json.actividades));
          } else {
            dispatch(actUserLoadingError('servicio no disponible'));
          }
        }).catch(error => {
          console.log(error.stack);
          dispatch(actUserLoadingError('servicio no disponible'));
        });
    }
  }
}

function validateActivity(info) {
  return function(dispatch) {
    dispatch(actPushing());
    var valid = false;
    if(info.action != null && info.action != 'instrucciones') {
      for (let s of info.staff) {
        if(s.token == info.code) {
          valid = true;
          break;
        }
      }
    } else if(info.action == 'instrucciones' || info.code == env.validtoken){
      valid = true;
    }
    var next = false;
    if(valid) {
      if(info.action != null) {
        for (let a of info.actividades) {
          if(a.estatus != 0 && a.estatus != 100) {
            if(a.horaInstrucciones == null && a.estatus == 10 && info.action === 'pista') {
              a.estatus = 20;
              a.horaInstrucciones = new Date();
            } else
            if(a.horaDesbloqueada == null && a.estatus == 20 && info.action === 'llegar') {
              a.estatus = 30;
              a.horaDesbloqueada = new Date();
            } else
            if(a.horaTerminada == null && a.estatus == 30 && info.action === 'instrucciones') {
              a.estatus = 40;
            } else
            if(a.horaTerminada == null && a.estatus == 40 && info.action === 'selfie') {
              a.estatus = 100;
              a.horaTerminada = new Date();
              a.calificacion = info.calificacion;
              next = true;
            }
            if(!next)
              break;
          } else if (a.estatus == 0 && next) {
            next = false;
            a.estatus = 10;
          }
        }
      }

      localRepository.saveActUser(info.actividades);
      var query = env.serverURL + '/rally/actividad/cambiar-estatus'
      var data = {
        'tokenStaff': info.code,
        'actividades': info.actividades
      };
      var dataStr = JSON.stringify(data);
      fetch(query, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: dataStr
      })
      .then(response => response.json())
      .then(json => {
        if(json.success) {
          var actividades = json.actividades;
          dispatch(actPushingDone(actividades));
        } else {
          var actividades = json.actividades;
          dispatch(actPushingDone(actividades));
        }
      }).catch(error => {
        dispatch(actPushingDone(info.actividades))
      });
    }
    dispatch(actPushingDone(info.actividades));
  }
}

module.exports = {loadActUser, fetchActUser, actUserLoading, actUserLoaded, actUserLoadingError, actPushing, actPushingDone, validateActivity};
