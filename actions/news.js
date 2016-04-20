'use strict'

var localRepository = require('../views/utils/localRepository');

var env = require('../env');
/*
 * action types
 */
const NEWS_LOADING = 'NEWS_LOADING';
const NEWS_LOADED = 'NEWS_LOADED';
const NEWS_LOADING_ERROR = 'NEWS_LOADING_ERROR';

/*
 * action creators
 */
function newsLoading() {
  return {
    type: NEWS_LOADING,
  };
}

function newsLoadingError(error) {
  return {
    type: NEWS_LOADING_ERROR,
    error: error,
  };
}

function newsLoaded(news) {
  return {
    type: NEWS_LOADED,
    news: news,
  };
}

function loadNews() {
  return function(dispatch) {
    dispatch(newsLoading());

    return localRepository.getSavedNews().then((news) => {
      if(news != null) {
        dispatch(newsLoaded(news));
      }
      dispatch(fetchNews());
    });
  }
}

function fetchNews(showLoading) {
  return function(dispatch) {
    if(showLoading) {
      dispatch(newsLoading());
    }

    var query = env.serverURL + '/noticias/lista/10/10';
    return fetch(query)
      .then(response => response.json())
      .then(json => {
        console.log("fetched news", json);
        if(json.success == true){
          localRepository.saveNews(json.noticias);
          dispatch(newsLoaded(json.noticias));
        } else {
          dispatch(newsLoadingError('servicio no disponible'));
        }
      }).catch(error => {
        console.log(error.stack);
        dispatch(newsLoadingError('servicio no disponible'));
      });
  }
}

module.exports = {loadNews, fetchNews, newsLoading, newsLoaded, newsLoadingError};
