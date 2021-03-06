'use strict'

var localRepository = require('../views/utils/localRepository');
var GCMServices = require('../views/utils/GCMServices');

var FBLoginManager = require('NativeModules').FBLoginManager;

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  ShareDialog,
  AccessToken
} = FBSDK;

var env = require('../env');

var staffActions = require('./staff');
var actividadesUser = require('./actividadesUser');
var appActions = require('./appActions');
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

function logOutAction() {
  return {
    type: LOG_OUT,
  };
}

function logOut() {
  localRepository.deleteAll();
  GCMServices.unsubscribeTopicAll();

  return function(dispatch) {
    // Se resetean todos los reducers
    dispatch(staffActions.staffInit());
    dispatch(appActions.endRally());
    dispatch(actividadesUser.actInit());
    dispatch(logOutAction());
  };
}

function logInError(error) {
  //localRepository.deleteAll();
  return {
    type: LOG_IN_ERROR,
    error: error,
  };
}

function logIn() {
  return function(dispatch) {
    dispatch(logInStart());
    return FBLoginManager.logInWithReadPermissions(["public_profile","email"]).then(
      function(result) {
        if (result.isCancelled) {
          dispatch(logInError('error al loguear usuario'));
        } else {
          AccessToken.getCurrentAccessToken().then(
            function(token) {
              var user = {token:token.accessToken};
              dispatch(loadFbData(user, true));
            }
          ).catch(error => {
            console.log(error.stack);
            dispatch(logInError('error al loguear usuario'));
          });
        }
      }
    ).catch(error => {
      console.log(error.stack);
      dispatch(logInError('error al loguear usuario'));
    });
  }
}

function registerUser(user, appToken) {
  return function(dispatch) {
    dispatch(logInStart());
    var query = env.serverURL + '/usuario/registrarFacebook/' + appToken + '/' + user.token;
    return fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true){
          user['userData'] = json.usuario;
          localRepository.saveProfileToStorage(user);
          dispatch(loadCurrentRally(user, false));
          dispatch(staffActions.loadStaff(user));
        } else {
          dispatch(logInError('token no válido'))
        }
      }).catch(error => {
        console.log(error.stack);
        dispatch(logInError('error al registrar usuario'))
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
      if(profile != null) {
        if(profile.userData != null) {
          dispatch(loadCurrentRally(profile, true));
          dispatch(staffActions.loadStaff(profile));
        } else {
          dispatch(updateProfileFinish(profile));
        }
      } else {
        dispatch(initialState());
      }
    });
  }
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
        dispatch(logInError('error al obtener info fb usuario'));
      });
  }
}

function loadUserData(user) {
  return function(dispatch) {
    dispatch(logInStart());
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
    dispatch(logInStart());
    if(fromStorage) {
      return localRepository.getCurrentRally().then((rally) => {
        if(rally != null) {
          user['currentRally'] = rally;
          GCMServices.subscribeTopic('equipo_' + rally.grupo.idGrupo);
          GCMServices.subscribeTopic('rally_' + rally.grupo.rally.idRally);
          if(fromStorage) {
            dispatch(updateProfileFinish(user));
            dispatch(loadFbData(user, true));
          } else {
            dispatch(updateProfileFinish(user));
            dispatch(staffActions.loadStaff(user));
          }
        } else {
          var rally = _calculateDefaultRally(user.userData);
          user['currentRally'] = rally;
          localRepository.saveCurrentRally(rally);
          GCMServices.subscribeTopic('equipo_' + rally.grupo.idGrupo);
          GCMServices.subscribeTopic('rally_' + rally.grupo.rally.idRally);
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
      GCMServices.subscribeTopic('equipo_' + rally.grupo.idGrupo);
      GCMServices.subscribeTopic('rally_' + rally.grupo.rally.idRally);
      if(fromStorage) {
        dispatch(loadFbData(user, true));
      } else {
        dispatch(updateProfileFinish(user));
        dispatch(staffActions.loadStaff(user));
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
