'use strict';
import React, {
  NativeModules,
  Platform
} from 'react-native';
var localRepository = require("./localRepository");
var GcmAndroid = require('gandalf-react-native-gcm-push-notification');

var GCMServices = {
  subscribeTopic : function(topic) {
    localRepository.getSubscribedTopics().then((topics) => {
      if(topics == null) {
        topics = [];
      }
      if(topics.indexOf(topic) < 0) {
        console.log("subscribe new topic: " + topic);
        if(Platform.OS === 'ios') {
          NativeModules.GCMReactModule.subscribeTopic('/topics/' + topic);
        } else {
          GcmAndroid.subscribeTopicSimple('/topics/' + topic);
        }
        topics.push(topic);
        localRepository.saveSubscribedTopics(topics);
      }
    });
  },
  unsubscribeTopic : function(topic) {
    console.log("unsubscribed from " + topic);
    if(Platform.OS === 'ios') {
      NativeModules.GCMReactModule.unsubscribeTopic('/topics/' + topic);
    } else {
      GcmAndroid.unsubscribeTopicSimple('/topics/' + topic);
    }
  },
  unsubscribeTopicAll : function() {
    localRepository.getSubscribedTopics().then((topics) => {
      var topicsLoop = topics.slice(0);         // Duplicamos el array
      for (var i = 0; i < topicsLoop.length; i++) {
        if (topicsLoop[i] != 'general') {
          this.unsubscribeTopic(topicsLoop[i]);
          var index = topics.indexOf(topicsLoop[i]);
          topics.splice(index, 1);
        }
      }
      localRepository.saveSubscribedTopics(topics);
    });
  }
};

module.exports = GCMServices;
