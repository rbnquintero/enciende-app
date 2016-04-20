'use strict';

//Declaramos el type Action
export type Action =
    { type: 'UPD_PROFILE_START' }
  | { type: 'UPD_PROFILE_STOP', user: Object }
  | { type: 'LOG_OUT' }
  | { type: 'LOG_IN' }
;

//Declaramos el type State
export type State = {
  isLoggedIn: boolean;
  isRegistered: boolean;
  isFetching: boolean;
  error: ?string;
  user: ?Object;
  fbData: ?Object;
  userData: ?Object;
  currentRally: ?Object;
  name: ?string;
};

const initialState = {
  isLoggedIn: false,
  isRegistered: false,
  isFetching: false,
  error: null,
  user: null,
  fbData: null,
  userData: null,
  currentRally: null,
  name: null,
};

function user(state: State = initialState, action: Action): State {
  if (action.type === 'UPD_PROFILE_START' || action.type === 'LOG_IN_START') {
    return {
      isLoggedIn: false,
      isRegistered: false,
      isFetching: true,
      error: null,
      user: null,
      fbData: null,
      userData: null,
      currentRally: null,
      name: null
    }
  } else if (action.type === 'UPD_PROFILE_STOP') {
    var user = action.user;
    var isRegistered = false;
    var userData = user.userData;
    var fbData = user.fbData;
    var currentRally = user.currentRally;
    var name = fbData.name;
    if(userData != null) {
      isRegistered = true;
      name = userData.nombre;
    }
    return {
      isLoggedIn: true,
      isRegistered: isRegistered,
      isFetching: false,
      error: null,
      user: user,
      fbData: fbData,
      userData: userData,
      currentRally: currentRally,
      name: name
    }
  } else if (action.type === 'USER_LOADING') {
    var name = null;
    var user = action.user;
    if(user.fbData != null) {
      name = user.fbData.name;
    }
    if(user.userData != null) {
      name = user.userData.nombre;
    }
    return {
      isLoggedIn: true,
      isRegistered: false,
      isFetching: true,
      error: null,
      user: action.user,
      fbData: user.fbData,
      userData: user.userData,
      currentRally: user.currentRally,
      name: name
    }
  }

  return initialState;
}

module.exports = user;
