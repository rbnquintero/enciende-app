'use strict'

var { combineReducers } = require('redux');

const enciendeReducers = combineReducers({
  user: require('./user'),
  navigation: require('./navigation'),
  news: require('./noticia'),
  actividadesUser: require('./actividadesUser')
});

export default enciendeReducers;
