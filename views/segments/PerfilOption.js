import React, {
  Component,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

class PerfilOption extends Component {
  props: {
    caption: string;
    onPress: () => void;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={{ borderTopWidth: 1 }}>
          <Text style={{ fontWeight:'200', marginVertical: 10 }}>{this.props.caption}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

module.exports = PerfilOption;
