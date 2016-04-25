import React, {
  Component,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

class Test extends Component {

  render() {
    return (
      <View style={{ flex: 1, marginTop: 64 }}>
        <TouchableOpacity onPress={ () => this.props.navigator.pop() }>
          <Text>
            Some
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = Test;
