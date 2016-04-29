'use strict'

var localRepository = require('../views/utils/localRepository');

var env = require('../env');
/*
 * action types
 */
const ACT_USER_LOADING = 'ACT_USER_LOADING';
const ACT_USER_LOADED = 'ACT_USER_LOADED';
const ACT_USER_LOADING_ERROR = 'ACT_USER_LOADING_ERROR';
const ACT_USER_RENDERED = 'ACT_USER_RENDERED';

/*
 * action creators
 */
function actUserLoading() {
  return {
    type: ACT_USER_LOADING,
  };
}

function actUserRendered() {
  return {
    type: ACT_USER_RENDERED,
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
      }
      dispatch(fetchActUser());
    });
  }
}

function fetchActUser(showLoading) {
  return function(dispatch) {
    if(showLoading) {
      dispatch(actUserLoading());
    }
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

module.exports = {loadActUser, fetchActUser, actUserLoading, actUserLoaded, actUserLoadingError, actUserRendered};
