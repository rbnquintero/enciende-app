'use strict'

var localRepository = require('../views/utils/localRepository');

var env = require('../env');
/*
 * action types
 */
const PANTALLA_RALLY = 'PANTALLA_RALLY';
const PANTALLA_NOTICIAS = 'PANTALLA_NOTICIAS';

/*
 * action creators
 */
function toMainHome() {
  return {
    type: PANTALLA_NOTICIAS,
  };
}

function toRallyHome() {
  return {
    type: PANTALLA_RALLY,
  };
}

module.exports = {toMainHome, toRallyHome, };
