'use strict'

var { combineReducers } = require('redux');

const enciendeReducers = combineReducers({
  user: require('./user'),
  navigation: require('./navigation'),
  news: require('./noticia'),
  staff: require('./staff'),
  actividadesUser: require('./actividadesUser'),
  app: require('./app'),
});

export default enciendeReducers;
