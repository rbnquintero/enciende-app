import React, {
  Component,
  Image,
} from 'react-native';

class ImageZoom extends Component {
  render() {
    return (
      <Image
        style={{ flex: 1, width: this.props.width, resizeMode: Image.resizeMode.contain }} source={{ uri: this.props.url }}/>
    );
  }
}

module.exports = ImageZoom;
