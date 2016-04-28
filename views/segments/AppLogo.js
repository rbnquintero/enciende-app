import React, {
  Component,
  Image,
  Text,
  StyleSheet,
  View
} from 'react-native';

class AppLogo extends Component {
  props: {
    caption: string;
    onPress: () => void;
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image source={ require('image!logo') } />
          <Text style={ styles.title} >
            enciende app
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color:'#FFFFFF', fontWeight: 'bold', fontSize: 25, textAlign: 'center'
  },
  container: {
    flexDirection: 'row', flex: 1, alignItems: 'flex-end',
  }
});

module.exports = AppLogo;
