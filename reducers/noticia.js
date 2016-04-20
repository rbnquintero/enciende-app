'use strict';

//Declaramos el type State
export type State = {
  isFetching: boolean;
  error: ?string;
  news: ?Object;
};

const initialState = {
  isFetching: false,
  error: null,
  news: null,
};

function user(state: State = initialState, action): State {
  if (action.type === 'NEWS_LOADING') {
    return {
      isFetching: true,
      error: null,
      news: null,
    }
  } else if (action.type === 'NEWS_LOADING_ERROR') {
    return {
      isFetching: false,
      error: action.error,
      news: null,
    }
  } else if (action.type === 'NEWS_LOADED') {
    return {
      isFetching: false,
      error: null,
      news: action.news,
    }
  }

  return initialState;
}

module.exports = user;
