'use strict';

//Declaramos el type State
export type State = {
  isFetching: boolean;
  error: ?string;
  news: ?Object;
  pendingRendering: boolean,
};

const initialState = {
  isFetching: false,
  error: null,
  news: null,
  pendingRendering: false,
};

function noticia(state: State = initialState, action): State {
  if (action.type === 'NEWS_LOADING') {
    return {
      isFetching: true,
      error: null,
      news: state.news,
      pendingRendering: false,
    }
  } else if (action.type === 'NEWS_LOADING_ERROR') {
    return {
      isFetching: false,
      error: action.error,
      news: state.news,
      pendingRendering: false,
    }
  } else if (action.type === 'NEWS_LOADED') {
    var news = action.news;
    if(news == null) {
      news = state.news;
    }
    return {
      isFetching: false,
      error: null,
      news: news,
      pendingRendering: true,
    }
  } else if (action.type === 'NEWS_RENDERED') {
    var news = action.news;
    if(news == null) {
      news = state.news;
    }
    return {
      isFetching: false,
      error: null,
      news: news,
      pendingRendering: false,
    }
  }

  return state;
}

module.exports = noticia;
