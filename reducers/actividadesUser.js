'use strict';

//Declaramos el type State
export type State = {
  isFetching: boolean;
  error: ?string;
  actividades: ?Object;
  isPushing: boolean;
};

const initialState = {
  isFetching: true,
  error: null,
  actividades: [],
  isPushing: false,
};

function actividadesUser(state: State = initialState, action): State {
  if (action.type === 'ACT_USER_LOADING') {
    return {
      isFetching: true,
      error: null,
      actividades: state.actividades,
      isPushing: false,
    }
  } else if (action.type === 'ACT_USER_LOADING_ERROR') {
    return {
      isFetching: false,
      error: action.error,
      actividades: state.actividades,
      isPushing: false,
    }
  } else if (action.type === 'ACT_USER_LOADED') {
    var actividades = action.actUser;
    if(actividades == null) {
      actividades = state.actividades;
    }
    return {
      isFetching: false,
      error: null,
      actividades: actividades,
      isPushing: false,
    }
  } else if (action.type === 'ACT_PUSHING') {
    return {
      isFetching: false,
      error: null,
      actividades: state.actividades,
      isPushing: true,
    }
  } else if (action.type === 'ACT_PUSHING_DONE') {
    var actividades = action.actUser;
    if(actividades == null) {
      actividades = state.actividades;
    }
    return {
      isFetching: false,
      error: null,
      actividades: actividades,
      isPushing: false,
    }
  }

  return state;
}

module.exports = actividadesUser;
