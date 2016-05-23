'use strict'

var localRepository = require('../views/utils/localRepository');

var env = require('../env');
/*
 * action types
 */
const PANTALLA_RALLY = 'PANTALLA_RALLY';
const PANTALLA_CONTACTO = 'PANTALLA_CONTACTO';
const PANTALLA_ESTATUS = 'PANTALLA_ESTATUS';
const PANTALLA_NOTICIAS = 'PANTALLA_NOTICIAS';
const PANTALLA_REGISTRO_USR = 'PANTALLA_REGISTRO_USR';
const PANTALLA_REGISTRO_GRP = 'PANTALLA_REGISTRO_GRP';

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

function toEstatus() {
  return {
    type: PANTALLA_ESTATUS,
  };
}

function toContacto() {
  return {
    type: PANTALLA_CONTACTO,
  };
}

function toPantallaRegistroUsr() {
  return {
    type: PANTALLA_REGISTRO_USR,
  };
}

function toPantallaRegistroGrp() {
  return {
    type: PANTALLA_REGISTRO_GRP,
  };
}

module.exports = {toMainHome, toRallyHome, toContacto, toEstatus, toPantallaRegistroGrp, toPantallaRegistroUsr, };
