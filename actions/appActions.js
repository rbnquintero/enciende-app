'use strict'

import React, {
  NativeModules,
  Platform,
} from 'react-native';

var LocationReportingService = NativeModules.LocationReportingService;
/*
 * action types
 */
const LOAD_EVENT_EMITER = 'LOAD_EVENT_EMITER';
const START_RALLY = 'START_RALLY';
const END_RALLY = 'END_RALLY';
const NOT_START_RALLY = 'NOT_START_RALLY';

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

function rallyNotStart() {
  return {
    type: NOT_START_RALLY,
  };
}

function startRally(group, user, finaldate) {
  return function(dispatch) {
    dispatch(rallyStarted());
    if(Platform.OS==='ios') {
      LocationReportingService.beginReportingLocation(group, user, finaldate);
    } else {
      LocationReportingService.beginReportingLocation(group, user, finaldate, 120000);
    }
  }
}

function endRally() {
  return function(dispatch) {
    dispatch(rallyEnded());
    LocationReportingService.stopReportingLocation();
  }
}

function rallyNotStarted(){
  return function(dispatch) {
    dispatch(rallyNotStart());
    LocationReportingService.stopReportingLocation();
  }
}

module.exports = {loadEventEmiter, startRally, endRally, rallyNotStarted};
