import React, {
  Component,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';
var {Text} = require('../../../js/common/Text');

class SideMenuItem extends Component {

  render() {
    var container = styles.container;
    var text = styles.text;
    if(this.props.selected) {
      text = styles.textSelected;
      container = styles.containerSelected;
    }

    return (
      <TouchableOpacity onPress={this.props.action}>
        <View style={ container }>
          <Image source={ this.props.icon } style={ styles.icon } />
          <Text style={ text }>{this.props.titulo}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 10, fontSize: 13, color: 'rgb(240,242,245)'
  },
  textSelected: {
    marginLeft: 10, fontWeight: '500', fontSize: 13, color: 'rgb(29,30,37)',
  },
  container: {
    flexDirection: 'row', paddingHorizontal: 10, height: 45, alignItems: 'center',
  },
  containerSelected: {
    flexDirection: 'row', paddingHorizontal: 10, height: 45, alignItems: 'center', backgroundColor: 'rgb(240,242,245)',
  },
  icon: {
    height: 20, width: 20, resizeMode: Image.resizeMode.contain,
  },
});

module.exports = SideMenuItem;
