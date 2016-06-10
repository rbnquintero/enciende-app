'use strict';

var env = {
  serverURL: 'http://app-enciende.rhcloud.com',
  //serverURL: 'http://localhost:8080/servicios',
  facebookURL: 'https://graph.facebook.com/v2.6/',
  facebookURI: 'me?fields=id,name,email,picture&access_token=',
  validtoken: 'ki$59%38IO#',
  gcmKey: 'AIzaSyCzMAHv3BudyDb5eXPziB6qmD5R4vr2oRk',
  gcmUrl: 'https://gcm-http.googleapis.com/gcm/send',
  timeout: function(ms, promise) {
    if(ms == null){
      ms = 30000;
    }
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  },
}

module.exports = env;
