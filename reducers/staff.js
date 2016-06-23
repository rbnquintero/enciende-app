'use strict';

//Declaramos el type State
export type State = {
  isFetching: boolean;
  error: ?string;
  staff: ?Object;
};

const initialState = {
  isFetching: false,
  error: null,
  staff: null,
};

function staff(state: State = initialState, action): State {
  if (action.type === 'STAFF_LOADING') {
    return {
      isFetching: true,
      error: null,
      staff: state.staff,
    }
  } else if (action.type === 'STAFF_LOADING_ERROR') {
    return {
      isFetching: false,
      error: action.error,
      staff: state.staff,
    }
  } else if (action.type === 'STAFF_LOADED') {
    return {
      isFetching: false,
      error: null,
      staff: action.staff,
    }
  } else if (action.type === 'STAFF_INIT') {
    return initialState;
  }

  return state;
}

module.exports = staff;
