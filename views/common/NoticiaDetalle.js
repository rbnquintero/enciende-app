import React, {
  Component,
  TouchableHighlight,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

var moment = require('moment');
var esLocale = require('moment/locale/es');

var Header = require('../../js/common/HeaderHome');

class NoticiaDetalle extends Component {

  render() {
    var noticia = this.props.noticia;
    var fecha = new Date(noticia.fechaNoticia);
    var fechaStr = moment(fecha).locale("es", esLocale).format('LL');
    return (
      <View style={{ flex: 1 }}>
        <Header
          title={noticia.titulo}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../../js/common/BackButtonIcon'),
            onPress: this.props.navigator.pop,
          }}/>
        <ScrollView>
          <View style={styles.imagenContainer}>
            <Image style={ styles.imagen } source={{ uri: noticia.urlImagen }} />
          </View>
          <Text style={styles.newscontainerTitulo}>{noticia.titulo}</Text>
          <Text style={styles.newscontainerDate}>{fechaStr}</Text>
          <Text style={styles.newscontainerResumen}>{noticia.resumen}</Text>
          <Text style={styles.newscontainerTexto}>{noticia.noticia}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagenContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'black',
  },
  imagen: {
    height: 300,
    resizeMode: Image.resizeMode.contain,
    flex: 1,
  },
  newscontainerTitulo: {
    marginTop: 5,
    marginHorizontal: 5,
    fontWeight: '100',
    textAlign: 'left',
    fontFamily: 'Helvetica',
    fontSize: 30,
  },
  newscontainerDate: {
    marginLeft: 5,
    marginBottom: 5,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: 'gray'
  },
  newscontainerResumen: {
    marginVertical: 10,
    marginHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'Helvetica',
    fontSize: 15,
  },
  newscontainerTexto: {
    marginHorizontal: 5,
    marginBottom: 5,
    fontFamily: 'Helvetica',
    fontSize: 13,
    color: 'gray',
    //textAlign: 'justify',
  },
});

module.exports = NoticiaDetalle;
