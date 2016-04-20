'use strict'

var { combineReducers } = require('redux');

const enciendeReducers = combineReducers({
  user: require('./user'),
  news: require('./noticia')
});

export default enciendeReducers;
