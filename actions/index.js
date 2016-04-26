'use strict'

const loginActions = require('./login');
const newsActions = require('./news');
const navigationActions = require('./navigation');

module.exports = {
  ...loginActions,
  ...newsActions,
  ...navigationActions,
};
