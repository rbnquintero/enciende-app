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
          title='Noticia'
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../../js/common/BackButtonIcon'),
            onPress: this.props.navigator.pop,
          }}/>
        <ScrollView style={{ marginHorizontal: 20 }}>
          <Text style={styles.newscontainerTitulo}>{noticia.titulo}</Text>
          <Text style={styles.newscontainerResumen}>{noticia.resumen}</Text>
          <Text style={styles.newscontainerDate}>{fechaStr}</Text>
          <View style={styles.bar}/>
          <View style={styles.imagenContainer}>
            <Image style={ styles.imagen } source={{ uri: noticia.urlImagen }} />
          </View>

          <Text style={styles.newscontainerTexto}>{noticia.noticia}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newscontainerTitulo: {
    marginTop: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'left',
    fontSize: 13,
  },
  newscontainerResumen: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'left',
    fontSize: 20,
  },
  newscontainerDate: {
    fontSize: 13,
    fontWeight: '400',
    color: '#a6a6a6',
  },
  bar: {
    borderColor: '#d9d9d9',
    borderTopWidth: 1,
    marginTop: 10,
    marginBottom: 25,
  },
  imagenContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'black',
  },
  imagen: {
    height: 150,
    resizeMode: Image.resizeMode.cover,
    flex: 1,
  },
  newscontainerTexto: {
    marginTop: 25,
    fontSize: 13,
    fontWeight: '300'
  },
});

module.exports = NoticiaDetalle;
