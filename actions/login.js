'use strict'

var localRepository = require('../views/utils/localRepository');
var GCMServices = require('../views/utils/GCMServices');

var FBLoginManager = require('NativeModules').FBLoginManager;
var env = require('../env');

var staffActions = require('./staff');
/*
 * action types
 */
const LOG_IN_START = 'LOG_IN_START';
const LOG_OUT = 'LOG_OUT';
const LOG_IN_ERROR = 'LOG_IN_ERROR';
const UPD_PROFILE_START = 'UPD_PROFILE_START';
const UPD_PROFILE_STOP = 'UPD_PROFILE_STOP';
const INITIAL_STATE = 'INITIAL_STATE';
const USER_LOADING = 'USER_LOADING';

/*
 * action creators
 */
function initialState() {
 return {
  type: INITIAL_STATE,
 };
}

/* LOGIN */
function logInStart() {
  return {
    type: LOG_IN_START,
  };
}

function logOut() {
  localRepository.deleteAll();
  return {
    type: LOG_OUT,
  };
}

function logInError(error) {
  localRepository.deleteAll();
  return {
    type: LOG_IN_ERROR,
    error: error,
  };
}

function logIn() {
  return function(dispatch) {
    dispatch(logInStart());

    return FBLoginManager.loginWithPermissions(["public_profile","email"], function(error, data) {
      if (!error) {
        var user = data.credentials;
        if(user == null) {
          user = data;
        }
        dispatch(loadFbData(user, true));
        dispatch(staffActions.loadStaff(user));
      } else {
        dispatch(logInError('error al loguear usuario'));
      }
    });
  }
}

function registerUser(user, appToken) {
  return function(dispatch) {
    dispatch(loadingUser(user));
    var query = env.serverURL + '/usuario/registrarFacebook/' + appToken + '/' + user.user.token;
    return fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true){
          user['userData'] = json.usuario;
          localRepository.saveProfileToStorage(user);
          dispatch(updateProfileFinish(user));
        } else {
          console.log('usuario no ligado');
          dispatch(updateProfileFinish(user));
        }
      }).catch(error => {
        console.log(error.stack);
        dispatch(logInError('error al obtener info usuario'))
      });
  }
}

/* PROFILE */
function updateProfileStart() {
  return {
   type: UPD_PROFILE_START,
  };
}

function updateProfileFinish(profile) {
  return {
    type: UPD_PROFILE_STOP,
    user: profile,
  };
}

function fetchProfile() {
  return function(dispatch) {
    dispatch(updateProfileStart());
    return localRepository.getProfileFromStorage().then((profile) => {
      GCMServices.subscribeTopic('general');
      if(profile != null) {
        dispatch(loadCurrentRally(profile, true));
        dispatch(staffActions.loadStaff(profile));
      } else {
        dispatch(initialState());
      }
    });
  }
}

/* EXTRAS */
function loadingUser(user) {
  return {
    type: USER_LOADING,
    user: user,
  };
}

function loadFbData(user, loadUserDataFlag) {
  return function(dispatch) {
    dispatch(logInStart());
    var query = env.facebookURL + env.facebookURI + user.token;
    return fetch(query)
      .then(response => response.json())
      .then(json => {
        user['fbData'] = json;
        localRepository.saveProfileToStorage(user);
        if(loadUserDataFlag) {
          dispatch(loadUserData(user));
        } else {
          dispatch(updateProfileFinish(user));
        }
      }).catch(error => {
        console.log(error.stack);
        dispatch(logInError('error al obtener info usuario'));
      });
  }
}

function loadUserData(user) {
  return function(dispatch) {
    dispatch(loadingUser(user));
    var query = env.serverURL + '/usuario/get/' + user.token;
    return fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true){
          user['userData'] = json.usuario;
          localRepository.saveProfileToStorage(user);
          dispatch(loadCurrentRally(user, false));
        } else {
          console.log('usuario no ligado');
          dispatch(updateProfileFinish(user));
        }
      }).catch(error => {
        console.log(error.stack);
        dispatch(logInError('error al obtener info usuario'))
      });
  }
}

function loadCurrentRally(user, fromStorage) {
  return function(dispatch) {
    dispatch(loadingUser(user));
    if(fromStorage) {
      return localRepository.getCurrentRally().then((rally) => {
        if(rally != null) {
          user['currentRally'] = rally;
          GCMServices.subscribeTopic('rally_' + rally.idRally);
          if(fromStorage) {
            dispatch(updateProfileFinish(user));
            dispatch(loadFbData(user, true));
          } else {
            dispatch(updateProfileFinish(user));
          }
        } else {
          var rally = _calculateDefaultRally(user.userData);
          user['currentRally'] = rally;
          localRepository.saveCurrentRally(rally);
          GCMServices.subscribeTopic('rally_' + rally.idRally);
          if(fromStorage) {
            dispatch(updateProfileFinish(user));
            dispatch(loadFbData(user, true));
          } else {
            dispatch(updateProfileFinish(user));
          }
        }
      });
    } else {
      var rally = _calculateDefaultRally(user.userData);
      user['currentRally'] = rally;
      localRepository.saveCurrentRally(rally);
      GCMServices.subscribeTopic('rally_' + rally.idRally);
      if(fromStorage) {
        dispatch(loadFbData(user, true));
      } else {
        dispatch(updateProfileFinish(user));
      }
    }
  }
}

/* FUNCIONES DE SOPORTE */
/* rally management */
function _calculateDefaultRally(userData) {
  return userData.grupoUsuarios[0];
}

module.exports = {logInStart, logOut, loadUserData, loadCurrentRally, registerUser, logIn, updateProfileStart, updateProfileFinish, fetchProfile};
