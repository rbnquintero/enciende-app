import React, {
  Component,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  requireNativeComponent,
  View
} from 'react-native';

var Header = require('../../js/common/Header');
var Orientation = require('react-native-orientation');
var ImageZoom = require('../../js/common/ImageZoom');

class NoticiaDetalleImagen extends Component {
  constructor(props) {
    super(props);
    this.state= {
      widthWindow: Dimensions.get('window').width,
    };
  }

  _orientationDidChange(orientation, or) {
    if(orientation == null){
      orientation = or;
    }
    if (orientation == 'LANDSCAPE') {
      this.setState({widthWindow: Dimensions.get('window').height});
    } else {
      this.setState({widthWindow: Dimensions.get('window').width});
    }
  }

  componentDidMount() {
    Orientation.getOrientation(this._orientationDidChange.bind(this));
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange.bind(this));
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Header
          style={{ backgroundColor: 'rgba(0,0,0,0)', }}
          leftItem={{
            layout: 'icon',
            iconstyle: { height: 15, width: 15 },
            title: 'Menu',
            icon: require('../../js/common/img/x-white@3x.png'),
            onPress: this.props.navigator.pop,
          }}/>
        <ScrollView style={{ flex: 1, flexDirection: 'row' }} maximumZoomScale={5.0} bouncesZoom={true} onScrollAnimationEnd={(data) => console.log(data)}>
          <ImageZoom url={this.props.noticia.urlImagen} width={this.state.widthWindow} />
        </ScrollView>
      </View>
    );
  }
}

module.exports = NoticiaDetalleImagen;
