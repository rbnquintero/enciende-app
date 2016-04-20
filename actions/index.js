'use strict'

const loginActions = require('./login');
const newsActions = require('./news');

module.exports = {
  ...loginActions,
  ...newsActions,
};
