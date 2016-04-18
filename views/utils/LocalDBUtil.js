import React, {
  Component,
  AsyncStorage
} from 'react-native';

const facebookURL = 'https://graph.facebook.com/v2.6/me?fields=id,name,email,picture&access_token=';
const coreURL = 'http://localhost:8080'
var FBLoginManager = require('NativeModules').FBLoginManager;

var STORAGE_KEY = '@AsyncStorageExample:key';
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

var key_noticias = 'key_noticias';
var key_facebook_profile_credentials = "key_facebook_profile_credentials";
var key_facebook_profile_info = "key_facebook_profile_info";
var key_profile_info = "key_profile_info";
var key_current_rally = "key_current_rally";

class LocalDBUtil extends Component {
  getFacebookProfile(caller) {
    this._getFacebookProfile(caller);
  }
  async _getFacebookProfile(caller) {
    var profileString = await AsyncStorage.getItem(key_profile_info);
    if(profileString != null){
      caller.setState({ myuser: JSON.parse(profileString), loading: false });
    } else {
      caller.setState({ loading: false });
    }
  }

  /* Register */
  registerID(caller) {
    this._registerID(caller).done();
  }
  async _registerID(caller) {
    var _this = this;
    var id = caller.state.userCode;
    var query = coreURL + '/servicios/usuario/registrarFacebook/' + caller.state.userCode + '/' + caller.state.myuser.token;
    fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true) {
          var user = caller.state.myuser;
          user['userData'] = json.usuario;
          //FB
          var query = facebookURL +  user.token;
          fetch(query)
            .then(response => response.json())
            .then(json => {
              user['fbData'] = json;
              _this.saveProfile(user);
              _this.saveDefaultRally(user.userData);
              caller.setState({ loading: false, myuser: user });
              caller.props.navBar.setState({myuser: user});
              _this.getCurrentRally(caller, user);
              caller.props.navigator.pop();
          }).catch(error => {
            console.log(error);
            _this.saveProfile(user);
            _this.saveDefaultRally(user.userData);
            caller.setState({ loading: false, myuser: user });
            caller.props.navBar.setState({myuser: user});
            _this.getCurrentRally(caller, user);
            caller.props.navigator.pop();
          });
        } else {
          console.log(json.errorMessage);
          caller.setState({ loading: false, error: true });
        }
    }).catch(error => {
      console.log(error);
      caller.setState({ loading: false, error: true });
    });
  }
  /* Log in */
  logInUsuario(caller) {
    this._logInUsuario(caller).done();
  }
  async _logInUsuario(caller) {
    var _this = this;
    FBLoginManager.loginWithPermissions(["public_profile","email"], function(error, data) {
      if (!error) {
        var query = coreURL + '/servicios/usuario/get/' + data.credentials.token;
        console.log(query);
        fetch(query)
          .then(response => response.json())
          .then(json => {
            if(json.success == true){
              data.credentials['userData'] = json.usuario;
              //FB
              var query = facebookURL +  data.credentials.token;
              fetch(query)
                .then(response => response.json())
                .then(json => {
                  data.credentials['fbData'] = json;
                  _this.saveProfile(data.credentials);
                  _this.saveDefaultRally(data.credentials.userData);
                  caller.setState({ loading: false, myuser: data.credentials });
                  _this.getCurrentRally(caller, data.credentials.userData);
                  caller.props.navBar.setState({myuser: data.credentials});
                  caller.props.navigator.pop();
              }).catch(error => {
                console.log(error);
                _this.saveProfile(data.credentials);
                _this.saveDefaultRally(data.credentials.userData);
                caller.props.navBar.setState({myuser: data.credentials});
                _this.getCurrentRally(caller, data.credentials.userData);
                caller.setState({ loading: false, myuser: data.credentials });
              });
            } else {
              console.log("usuario no ligado", data.credentials);
              _this.saveProfile(data.credentials);
              caller.setState({ loading: false, myuser: data.credentials });
            }
          }).catch(error => {
            console.log(error);
            caller.setState({ loading: false, error: true });
          });
      } else {
        console.log("data: ", data);
        console.log("error: ", error);
        caller.setState({ loading: false, error: true });
      }
    });
  }

  /* rally managemeng */
  getDefaultRally(userData) {
    return userData.grupoUsuarios[0];
  }
  saveDefaultRally(userData) {
    console.log("rally to save userdata", userData);
    var rally = this.getDefaultRally(userData);
    console.log("rally to save", rally);
    this.saveCurrentRally(rally);
  }
  saveCurrentRally(rally){
    AsyncStorage.setItem(key_current_rally, JSON.stringify(rally));
  }

  /* Trae la info del usuario de facebook y core */
  getPerfilData(caller) {
    this._getPerfilDataAsync(caller).done();
  }
  async _getPerfilDataAsync(caller) {
    var _this = this;
    var profileFbInfoString = await AsyncStorage.getItem(key_profile_info);
    if(profileFbInfoString == null){
      return;
    }
    var profile = JSON.parse(profileFbInfoString);
    var query = facebookURL +  profile.token;

    fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.error != null) {
          FBLoginManager.loginWithPermissions(["public_profile","email"], function(error, data) {
            if (!error) {
              AsyncStorage.setItem(key_facebook_profile_credentials, JSON.stringify(data.credentials));
              var newQuery = facebookURL + data.credentials.token;
              fetch(newQuery)
                .then(response => response.json())
                .then(json => {
                  if(json.error != null) {
                    //load data from DB
                  } else {
                    console.log(json);
                    // fetch info from core
                  }
                }).catch(error => {
                  console.log(error);
                  //load data from DB
                });
            } else {
              console.log("no se pudo loguear aal usuario");
              return;
            }
          });
        } else {
          profile['fbData'] = json;
          console.log("happy path",profile);
          // fetch info from core
          var query = coreURL + '/servicios/usuario/get/' + profile.token;
          fetch(query)
            .then(response => response.json())
            .then(json => {
              if(json.success == true){
                profile['userData'] = json.usuario;
                _this.getCurrentRally(caller, profile);
                console.log("core response get profile: ", profile);
                _this.saveProfile(profile);
                caller.setState({ myuser: profile });
              } else {
                console.log("error")
              }
            }).catch(error => {
              console.log(error);
              //??
            });
        }

      }).catch(error => {
        console.log(error);
        // fetch info from core
      });
  }

  getCurrentRally(caller) {
    this._getCurrentRally(caller);
  }
  async _getCurrentRally(caller) {
    var currentRally = await AsyncStorage.getItem(key_current_rally);
    var profile = caller.state.myuser;
    console.log("currentRally", currentRally);
    profile['currentRally'] = JSON.parse(currentRally);
    caller.setState({ myuser: profile });
  }

  saveProfile(profile) {
    this._saveProfile(profile).done();
  }
  async _saveProfile(profile) {
    await AsyncStorage.setItem(key_profile_info, JSON.stringify(profile));
  }

  saveFacebookProfileCredentials(profile) {
    this._saveFacebookProfileCredentials(profile).done();
  }
  async _saveFacebookProfileCredentials(profile) {
    await AsyncStorage.setItem(key_facebook_profile_credentials, JSON.stringify(profile));
  }

  saveNoticias(noticias) {
    this._saveNoticias(noticias).done();
  }
  async _saveNoticias(noticias) {
    await AsyncStorage.setItem(key_noticias, JSON.stringify(noticias));
  }

  async deleteAll() {
    await AsyncStorage.removeItem(key_facebook_profile_credentials);
    await AsyncStorage.removeItem(key_profile_info);
    await AsyncStorage.removeItem(key_current_rally);
  }

}

module.exports = LocalDBUtil;
