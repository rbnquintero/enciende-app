import React, {
  Component,
  TouchableHighlight,
  Platform,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');

class Loader extends Component {

  render() {
    var spinner;
    if(Platform.OS === 'ios') {
        spinner = (
          <View style={styles.spinnerContainerAndroid}>
            <View style={styles.spinnerContainer}>
              <ActivityIndicatorIOS
              style={styles.spinnerr}
              hidden='true'
              size='large'/>
              <Text style={{ fontSize: 17, fontWeight: '200', marginTop: 10 }}>
                {this.props.caption}
              </Text>
            </View>
          </View>
        );
    } else {
      spinner = (
        <View style={styles.spinnerContainerAndroid}>
          <View style={styles.spinnerContainer}>
            <ProgressBarAndroid/>
            <Text style={{ fontSize: 17, fontWeight: '200', marginTop: 10 }}>
              {this.props.caption}
            </Text>
          </View>
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
