'use strict';

var store = require('react-native-simple-store');

const key_profile_info = "key_profile_info";
const key_current_rally = "key_current_rally";
const key_saved_news = "key_saved_news";
const key_saved_staff = "key_saved_staff";
const key_saved_activities_user = "key_saved_activities_user";
const key_selfies_to_upload = "key_selfies_to_upload";
const key_subscribed_topics_gcm = "key_subscribed_topics_gcm";

var localRepository = {
  /** PERFIL **/
  getProfileFromStorage : function() {
    return store.get(key_profile_info);
  },
  deleteAll : function() {
    store.delete(key_profile_info);
    store.delete(key_current_rally);
    store.delete(key_saved_staff);
    store.delete(key_saved_activities_user);
    store.delete(key_selfies_to_upload);
  },
  saveProfileToStorage : function(profile) {
    return store.save(key_profile_info, profile);
  },

  /** RALLY **/
  getCurrentRally : function() {
    return store.get(key_current_rally);
  },
  saveCurrentRally : function(rally) {
    return store.save(key_current_rally, rally);
  },

  /** NEWS **/
  getSavedNews : function() {
    return store.get(key_saved_news);
  },
  saveNews : function(news) {
    return store.save(key_saved_news, news);
  },

  /** ACTIVIDADES USER **/
  getSavedActUser : function() {
    return store.get(key_saved_activities_user);
  },
  saveActUser : function(actUser) {
    return store.save(key_saved_activities_user, actUser);
  },

  /** STAFF **/
  getSavedStaff : function() {
    return store.get(key_saved_staff);
  },
  saveStaff : function(staff) {
    return store.save(key_saved_staff, staff);
  },

  /** SELFIES A SUBIR **/
  getSelfiesASubir : function(){
    return store.get(key_selfies_to_upload);
  },
  saveSelfiesASubir : function(selfies){
    return store.save(key_selfies_to_upload,selfies);
  },

  /** SUBSCRIBED TOPICS **/
  getSubscribedTopics : function(){
    return store.get(key_subscribed_topics_gcm);
  },
  saveSubscribedTopics : function(topics){
    return store.save(key_subscribed_topics_gcm,topics);
  },
};

module.exports = localRepository;
