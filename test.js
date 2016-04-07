import React, {
  Component,
  TouchableHighlight,
  Text,
  View
} from 'react-native';

class Test extends Component {

  render() {
    return (
      <View style={{ flex: 1, marginTop: 64 }}>
        <TouchableHighlight onPress={ () => this.props.navigator.pop() }>
          <Text>
            Some
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = Test;
