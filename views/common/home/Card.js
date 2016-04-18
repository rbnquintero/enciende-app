import React, {
  Component,
  Image,
  Text,
  Time,
  StyleSheet,
  View
} from 'react-native';

var moment = require('moment');
var esLocale = require('moment/locale/es');

class Card extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  //<Image source={{uri: evento.urlImagen}} style={styles.newscontainerImage}/>

  render() {
    var evento = this.props.data;
    var fecha = new Date(evento.fechaNoticia);
    var fechaStr = moment(fecha).locale("es", esLocale).format('LL');
    console.log(fechaStr);
    return (
      <View style={styles.newscontainer} ref={component => this._root = component} {...this.props}>
        <View style={styles.newscontainerImageContainer}>
          <Image source={{uri: evento.urlImagen}} style={styles.newscontainerImage}/>
        </View>
        <Text style={styles.newscontainerTitulo}>{evento.titulo}</Text>
        <Text style={styles.newscontainerDate}>{fechaStr}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newscontainer: {
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#d9d9d9',
    backgroundColor: 'white',
    alignItems: 'stretch'
  },
  newscontainerImageContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  newscontainerImage: {
    flex: 1,
    resizeMode: Image.resizeMode.cover,
    height: 200,
  },
  newscontainerTitulo: {
    marginTop: 5,
    marginHorizontal: 5,
    fontWeight: '100',
    textAlign: 'left',
    fontFamily: 'Helvetica',
    fontSize: 20,
  },
  newscontainerDate: {
    marginLeft: 5,
    marginBottom: 5,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: 'gray'
  },
});

module.exports = Card;
