import React, {
  Component,
  AsyncStorage
} from 'react-native';

var STORAGE_KEY = '@AsyncStorageExample:key';
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

class LocalDBUtil extends Component {
  someTest() {
    console.log("Test success!");
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null){
        console.log('Recovered selection from disk: ' + value);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, COLORS[0]);
        console.log('Initialized with no selection on disk.');
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
}

module.exports = LocalDBUtil;
