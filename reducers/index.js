'use strict'

var { combineReducers } = require('redux');

const enciendeReducers = combineReducers({
  user: require('./user'),
  navigation: require('./navigation'),
  news: require('./noticia')
});

export default enciendeReducers;
