import React, {
  Component,
  View
} from 'react-native';

var Home = require('./RallyHome');

class RallyNavigator extends Component {

  render() {
    return (
      <Home/>
    );
  }
}

module.exports = RallyNavigator;
