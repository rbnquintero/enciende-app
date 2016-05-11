/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 import React, {
   AppRegistry,
   Component,
   Text
 } from 'react-native';

const Setup = require('./setup');
var {Router, Route, Schema, Animations, TabBar} = require('react-native-router-flux');
var GcmAndroid = require('gandalf-react-native-gcm-push-notification');
import Notification from 'gandalf-react-native-system-notification';

if (GcmAndroid.launchNotification) {
  var notification = GcmAndroid.launchNotification;
  var info = JSON.parse(notification.info);
  Notification.create({
    subject: info.subject,
    message: info.message,
  });
  GcmAndroid.stopService();
} else {
  function setupWrapper(): Component {
   class Root extends Component {
     componentDidMount() {
       GcmAndroid.addEventListener('register', function(data){
         if(!data.error){
             console.log('send gcm token to server', data.registrationToken);
         }
       });
       GcmAndroid.addEventListener('notification', function(notification){
         var info = JSON.parse(notification.data.notification);
         if (!GcmAndroid.isInForeground) {
           Notification.create({
             subject: info.subject,
             message: info.message,
           });
         }
       });
       GcmAndroid.requestPermissions();
     }

     render() {
       return (
         <Setup/>
       );
     }
   }
   return Root;
  }

  AppRegistry.registerComponent('enciendeApp', setupWrapper);

}
