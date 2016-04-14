import React, {
  Component,
  TouchableHighlight,
  Text,
  Platform,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  StyleSheet,
  View
} from 'react-native';

class Loader extends Component {

  render() {
    var spinner;
    if(Platform.OS === 'ios') {
        spinner = ( <ActivityIndicatorIOS
          style={styles.spinner}
          hidden='true'
          size='large'/> );
    } else {
      spinner = (
        <View style={styles.spinnerContainerAndroid}>
          <ProgressBarAndroid/>
        </View>
      );
    }
    return (<View style={styles.spinnerContainer}>{spinner}</View>);
  }
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignItems: 'center'
  },
  spinnerContainerAndroid: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  spinner: {
    flex:1,
  }
});

module.exports = Loader;
