'use strict'

import React, {
  NativeModules
} from 'react-native';

var LocationReportingService = NativeModules.LocationReportingService;
/*
 * action types
 */
const LOAD_EVENT_EMITER = 'LOAD_EVENT_EMITER';
const START_RALLY = 'START_RALLY';
const END_RALLY = 'END_RALLY';

/*
 * action creators
 */
function loadEventEmiter(emiter) {
  return {
    type: LOAD_EVENT_EMITER,
    emiter: emiter,
  };
}

function rallyStarted() {
  return {
    type: START_RALLY,
  };
}

function rallyEnded() {
  return {
    type: END_RALLY,
  };
}

function startRally(finaldate) {
  return function(dispatch) {
    dispatch(rallyStarted());
    LocationReportingService.beginReportingLocation("3", "7", finaldate);
  }
}

function endRally() {
  return function(dispatch) {
    dispatch(rallyEnded());
    LocationReportingService.stopReportingLocation();
  }
}

module.exports = {loadEventEmiter, startRally, endRally, };
