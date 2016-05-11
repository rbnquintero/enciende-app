'use strict'

var localRepository = require('../views/utils/localRepository');

var env = require('../env');
/*
 * action types
 */
const STAFF_LOADING = 'STAFF_LOADING';
const STAFF_LOADED = 'STAFF_LOADED';
const STAFF_LOADING_ERROR = 'STAFF_LOADING_ERROR';

/*
 * action creators
 */
function staffLoading() {
  return {
    type: STAFF_LOADING,
  };
}

function staffLoadingError(error) {
  return {
    type: STAFF_LOADING_ERROR,
    error: error,
  };
}

function staffLoaded(staff) {
  return {
    type: STAFF_LOADED,
    staff: staff,
  };
}

function loadStaff(user) {
  return function(dispatch) {
    dispatch(staffLoading());

    return localRepository.getSavedStaff().then((staff) => {
      if(staff != null) {
        dispatch(staffLoaded(staff));
      }
      dispatch(fetchStaff(user, false));
    });
  }
}

function fetchStaff(user, showLoading) {
  var rally = '1';
  if(user != null && user.currentRally != null) {
    rally = String(user.currentRally.grupo.rally.idRally);
  }

  return function(dispatch) {
    if(showLoading) {
      dispatch(staffLoading());
    }

    var query = env.serverURL + '/rally/' + rally + '/staff';
    return fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true){
          localRepository.saveStaff(json.grupos);
          dispatch(staffLoaded(json.grupos));
        } else {
          dispatch(staffLoadingError('servicio no disponible'));
        }
      }).catch(error => {
        console.log(error.stack);
        dispatch(staffLoadingError('servicio no disponible'));
      });
  }
}

module.exports = {loadStaff, fetchStaff, staffLoading, staffLoadingError, staffLoaded};
