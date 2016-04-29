import React, {
  Component,
  TouchableOpacity,
  Text,
  Image,
  View
} from 'react-native';

class ActivitySegment extends Component {

  render() {
    var image = (
      <Image
        style={{ resizeMode: Image.resizeMode.contain, width: 30, height: 30 }}
        source={require('../../js/common/img/lock.png')}/>
    );
    var desc = null;
    if(this.props.actividad.estatus == '2') {
      image = null;
      if(this.props.actividad.horaInstrucciones != null) {
        desc = this.props.actividad.actividad.instrucciones;
      } else if (this.props.actividad.horaDesbloqueada) {
        desc = 'Como llegar: ' + this.props.actividad.actividad.comoLlegar;
      } else {
        desc = 'Pista: ' + this.props.actividad.actividad.pistaLugar;
      }
    } else if (this.props.actividad.estatus == '3') {
      image = (
        <Image
          style={{ resizeMode: Image.resizeMode.contain, width: 30, height: 30 }}
          source={require('../../js/common/img/ok.png')}/>
      );
      desc = this.props.actividad.actividad.instrucciones;
    }

    return (
      <View style={{ backgroundColor: '#f2f2f2', paddingHorizontal: 10, paddingVertical: 6, borderBottomWidth: 1, borderColor: 'gray' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 25, fontWeight: '200', flex: 1 }}>
            {this.props.actividad.actividad.nombre}
          </Text>
          {image}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 6, }}>
          <Text style={{ fontSize: 13, fontWeight: '200', color: 'gray', flex: 1 }}>
            {desc}
          </Text>
        </View>
      </View>
    );
  }
}

module.exports = ActivitySegment;
