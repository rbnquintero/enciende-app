'use strict'

const loginActions = require('./login');
const newsActions = require('./news');
const staffActions = require('./staff');
const actividadesUser = require('./actividadesUser');
const navigationActions = require('./navigation');
const appActions = require('./appActions');

module.exports = {
  ...loginActions,
  ...newsActions,
  ...staffActions,
  ...navigationActions,
  ...actividadesUser,
  ...appActions,
};
