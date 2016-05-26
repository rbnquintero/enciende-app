import React, {
  Component,
  Image,
  Time,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('../../../js/common/Text');
var FitImage = require('../../../js/common/FitImage');

var moment = require('moment');
var esLocale = require('moment/locale/es');

class Card extends Component {
  setNativeProps(nativeProps) {
    //this._root.setNativeProps(nativeProps);
  }
  //<Image source={{uri: evento.urlImagen}} style={styles.newscontainerImage}/>

  render() {
    var evento = this.props.data;
    var fecha = new Date(evento.fechaNoticia);
    var fechaStr = moment(fecha).locale("es", esLocale).format('LL');
    return (
      <FitImage source={{uri: evento.urlImagen}} style={styles.newscontainer}
        ref={component => this._root = component} {...this.props} content={
        <View style={{backgroundColor: 'rgba(0,0,0,0.4)', height: 220, }}>
          <View style={{flex: 1}}/>
          <Text style={styles.newscontainerTitulo}>{evento.resumen}</Text>
          <Text style={styles.newscontainerDate}>{fechaStr}</Text>
        </View>
      }/>
    );
  }
}

const styles = StyleSheet.create({
  newscontainer: {
    borderColor: '#d9d9d9',
    backgroundColor: 'white',
    alignItems: 'stretch',
    height: 220,
  },
  newscontainerTitulo: {
    paddingHorizontal: 20,
    letterSpacing : 0.5,
    textAlign: 'left',
    fontSize: 22,
    color: 'white',
  },
  newscontainerDate: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontSize: 12,
    color: 'rgb(184,185,189)',
  },
});

module.exports = Card;
