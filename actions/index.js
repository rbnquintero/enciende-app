'use strict'

const loginActions = require('./login');
const newsActions = require('./news');
const actividadesUser = require('./actividadesUser');
const navigationActions = require('./navigation');

module.exports = {
  ...loginActions,
  ...newsActions,
  ...navigationActions,
  ...actividadesUser,
};
