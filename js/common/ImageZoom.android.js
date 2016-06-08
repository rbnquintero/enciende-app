import React, {
  Component,
} from 'react-native';

import Image from 'react-native-image-zoom';

class ImageZoom extends Component {
  render() {
    return (
      <Image
        style={{ flex: 1, width: this.props.width }} source={{ uri: this.props.url }}/>
    );
  }
}

module.exports = ImageZoom;
