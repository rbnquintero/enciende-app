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
    var text = (<Text style={ styles.text }>{this.props.titulo}</Text>);
    if(this.props.selected) {
      text = (<Text style={ styles.textSelected }>{this.props.titulo}</Text>);
      container = styles.containerSelected;
    }

    return (
      <TouchableOpacity onPress={this.props.action}>
        <View style={ container }>
          <Image source={ require('image!logo') } style={ styles.profilePic } />
          {text}
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
