'use strict';

//Declaramos el type State
export type State = {
  isFetching: boolean;
  error: ?string;
  actividades: ?Object;
};

const initialState = {
  isFetching: true,
  error: null,
  actividades: [],
};

function actividadesUser(state: State = initialState, action): State {
  if (action.type === 'ACT_USER_LOADING') {
    return {
      isFetching: true,
      error: null,
      actividades: state.actividades,
    }
  } else if (action.type === 'ACT_USER_LOADING_ERROR') {
    return {
      isFetching: false,
      error: action.error,
      actividades: state.actividades,
    }
  } else if (action.type === 'ACT_USER_LOADED') {
    return {
      isFetching: false,
      error: null,
      actividades: action.actUser,
    }
  } else if (action.type === 'ACT_USER_RENDERED') {
    return {
      isFetching: false,
      error: null,
      actividades: action.actUser,
    }
  }

  return state;
}

module.exports = actividadesUser;
