import React, {
  Component,
  TouchableHighlight,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');

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
    height: 220,
    resizeMode: Image.resizeMode.cover,
    flex: 1,
  },
  newscontainerTitulo: {
    marginTop: 5,
    marginHorizontal: 5,
    fontWeight: '100',
    textAlign: 'left',
    fontSize: 30,
  },
  newscontainerDate: {
    marginLeft: 5,
    marginBottom: 10,
    fontSize: 10,
    color: 'gray'
  },
  newscontainerResumen: {
    marginBottom: 5,
    marginHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 15,
  },
  newscontainerTexto: {
    marginHorizontal: 5,
    marginBottom: 5,
    fontSize: 13,
    color: 'gray',
  },
});

module.exports = NoticiaDetalle;
