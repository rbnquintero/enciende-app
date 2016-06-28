import React, {
  Component,
  TouchableOpacity,
  Image,
  View
} from 'react-native';
var {Text} = require('./Text');

class ActivitySegment extends Component {

  render() {
    var titleStyle = {opacity: 0.7};
    var image = (
      <Image
        style={{ resizeMode: Image.resizeMode.contain, width: 30, height: 30 }}
        source={require('image!actbloq')}/>
    );
    var desc = 'Actividad bloqueada';
    if(this.props.actividad.estatus != 0 && this.props.actividad.estatus != 100 && this.props.actividad.estatus != null) {
      titleStyle = null;
      image = (
        <Image
          style={{ resizeMode: Image.resizeMode.contain, width: 30, height: 30 }}
          source={require('image!actworking')}/>
      );
      if(this.props.actividad.estatus == 30) {
        desc = this.props.actividad.actividad.instrucciones;
      } else if (this.props.actividad.estatus == 20) {
        desc = 'Como llegar: ' + this.props.actividad.actividad.comoLlegar;
      } else {
        desc = 'Pista: ' + this.props.actividad.actividad.pistaLugar;
      }
    } else if (this.props.actividad.estatus == 100) {
      titleStyle = null;
      image = (
        <Image
          style={{ resizeMode: Image.resizeMode.contain, width: 30, height: 30 }}
          source={require('image!actok')}/>
      );
      desc = this.props.actividad.actividad.instrucciones;
    }

    return (
      <View style={{ backgroundColor: 'transparent', marginHorizontal: 30, paddingVertical: 21, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {image}
          <View style={{ marginLeft: 10 }}>
            <Text style={[ {color: 'white', fontSize: 15, flex: 1}, titleStyle ]}>
              {this.props.actividad.actividad.nombre}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 12, color: 'white', opacity: 0.7, flex: 1 }}>
              {desc}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = ActivitySegment;
