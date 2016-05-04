import React, {
  Component,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

class SideMenuItem extends Component {

  render() {
    var container = styles.container;
    var text = styles.text;
    if(this.props.selected) {
      text = styles.textSelected;
      container = styles.containerSelected;
      if(this.props.rally) {
        text = styles.textSelectedRally;
      }
    }

    return (
      <TouchableOpacity onPress={this.props.action}>
        <View style={ container }>
          <Image source={ require('image!logo') } style={ styles.profilePic } />
          <Text style={ text }>{this.props.titulo}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 10, fontWeight: '500', fontSize: 13,
  },
  textSelected: {
    marginLeft: 10, fontWeight: '500', fontSize: 13, color: '#6600cc',
  },
  textSelectedRally: {
    marginLeft: 10, fontWeight: '500', fontSize: 13, color: '#800000',
  },
  container: {
    flexDirection: 'row', paddingHorizontal: 10, height: 45, alignItems: 'center',
  },
  containerSelected: {
    flexDirection: 'row', paddingHorizontal: 10, height: 45, alignItems: 'center', backgroundColor: '#d9d9d9',
  },
  profilePic: {
    height: 20, width: 20, resizeMode: Image.resizeMode.contain,
  },
});

module.exports = SideMenuItem;
