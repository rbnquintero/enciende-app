'use strict';
import React, {
  NativeModules,
  Platform
} from 'react-native';
var GcmAndroid = require('gandalf-react-native-gcm-push-notification');

var GCMServices = {
  subscribeTopic : function(topic) {
    if(Platform.OS === 'ios') {
      NativeModules.GCMReactModule.subscribeTopic('/topics/' + topic);
    } else {
      GcmAndroid.subscribeTopicSimple('/topics/' + topic);
    }
  },
  unsubscribeTopic : function(topic) {
    if(Platform.OS === 'ios') {
      NativeModules.GCMReactModule.unsubscribeTopic('/topics/' + topic);
    } else {

    }
  },
};

module.exports = GCMServices;
