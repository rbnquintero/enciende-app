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
      isLoggedIn: state.isLoggedIn,
      isRegistered: state.isRegistered,
      isFetching: true,
      error: null,
      user: state.user,
      fbData: state.fbData,
      userData: state.userData,
      currentRally: state.currentRally,
      name: state.name
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
      isLoggedIn: state.isLoggedIn,
      isRegistered: state.isRegistered,
      isFetching: true,
      error: null,
      user: action.user,
      fbData: user.fbData,
      userData: user.userData,
      currentRally: user.currentRally,
      name: name
    }
  } else if (action.type === 'LOG_IN_ERROR') {
    return {
      isLoggedIn: state.isLoggedIn,
      isRegistered: state.isRegistered,
      isFetching: false,
      error: action.error,
      user: state.user,
      fbData: state.fbData,
      userData: state.userData,
      currentRally: state.currentRally,
      name: state.name
    }
  } else if (action.type === 'LOG_OUT') {
    return initialState;
  } else if (action.type === 'INITIAL_STATE') {
    return initialState;
  }

  return state;
}

module.exports = user;
