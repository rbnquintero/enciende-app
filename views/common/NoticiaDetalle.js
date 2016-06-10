import React, {
  Component,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');

var moment = require('moment');
var esLocale = require('moment/locale/es');

var Header = require('../../js/common/HeaderHome');
var NoticiaDetalleImagen = require('./NoticiaDetalleImagen');

class NoticiaDetalle extends Component {
  toDetalleImagen() {
    this.props.navigator.push({
      title: "Noticia",
      name: 'NoticiaDetalleImagen',
      component: NoticiaDetalleImagen,
      passProps: {noticia: this.props.noticia},
      fromBottom: true,
    });
  }

  render() {
    var width = Dimensions.get('window').height;
    var height = width / 3;
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
          <TouchableOpacity onPress={() => this.toDetalleImagen()}>
            <View style={styles.imagenContainer}>
              <Image style={ [styles.imagen, { height: height, width: width }] } source={{ uri: noticia.urlImagen }} />
            </View>
          </TouchableOpacity>

          <Text style={styles.newscontainerTexto}>{noticia.noticia}</Text>
          <View style={{height:35}}/>
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
    backgroundColor: 'rgba(0,0,0,0)',
  },
  imagen: {
    resizeMode: Image.resizeMode.contain,
    flex: 1,
  },
  newscontainerTexto: {
    marginVertical: 25,
    fontSize: 13,
    fontWeight: '300'
  },
});

module.exports = NoticiaDetalle;
