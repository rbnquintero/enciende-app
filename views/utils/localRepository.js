'use strict';

var store = require('react-native-simple-store');

const key_profile_info = "key_profile_info";
const key_current_rally = "key_current_rally";
const key_saved_news = "key_saved_news";

var localRepository = {
  /** PERFIL **/
  getProfileFromStorage : function() {
    return store.get(key_profile_info);
  },
  deleteAll : function() {
    store.delete(key_profile_info);
    store.delete(key_current_rally);
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
  }
};

module.exports = localRepository;
