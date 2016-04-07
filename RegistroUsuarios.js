import React, {
  Component,
  StyleSheet,
  Image,
  TouchableHighlight,
  Navigator,
  Text,
  View
} from 'react-native';

var TestComponent = require('./test');

class RegistroUsuarios extends Component {
  renderScene(route, navigator) {
    console.log(route.name);
    return (<TestComponent />);
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 64 }}>
        <View style={[styles.flex]}>
          <TouchableHighlight onPress={ () => this.props.navigator.pop() }>
            <Text>
              Somer
            </Text>
          </TouchableHighlight>
        </View>
        <View style={[styles.flex]}>
          <Text>
            Someo
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex : {
    flex : 1
  }
});

module.exports = RegistroUsuarios;
