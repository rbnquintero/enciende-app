'use strict';

var store = require('react-native-simple-store');

const key_profile_info = "key_profile_info";
const key_current_rally = "key_current_rally";
const key_saved_news = "key_saved_news";
const key_saved_staff = "key_saved_staff";
const key_saved_activities_user = "key_saved_activities_user";

var localRepository = {
  /** PERFIL **/
  getProfileFromStorage : function() {
    return store.get(key_profile_info);
  },
  deleteAll : function() {
    store.delete(key_profile_info);
    store.delete(key_current_rally);
    store.delete(key_saved_news);
    store.delete(key_saved_staff);
    store.delete(key_saved_activities_user);
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
};

module.exports = localRepository;
