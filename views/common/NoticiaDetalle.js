import React, {
  Component,
  TouchableHighlight,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

class NoticiaDetalle extends Component {

  render() {
    var noticia = this.props.noticia;
    return (
      <View style={{ flex: 1, marginTop: 64 }}>
        <ScrollView>
          <View style={styles.imagenContainer}>
            <Image style={ styles.imagen } source={{ uri: noticia.urlImagen }} />
          </View>
          <Text style={styles.newscontainerTitulo}>{noticia.titulo}</Text>
          <Text style={styles.newscontainerDate}>{noticia.fechaNoticia}</Text>
          <Text style={styles.newscontainerResumen}>{noticia.resumen}</Text>
          <Text style={styles.newscontainerTexto}>{noticia.noticia}</Text>
        </ScrollView>
        <View style={styles.timercontainer}>
          <View style={styles.timercontainerContainer}>
            <Text style={styles.timercontainerText}>Faltan 23:12:18 días</Text>
          </View>
        </View>
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
  timercontainer: {
    backgroundColor: '#404040',
    height: 33,
    alignItems: 'center',
  },
  timercontainerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  timercontainerText: {
    color: 'white',
    fontWeight: '100',
    fontSize: 22,
    fontFamily: 'Helvetica',
  }
});

module.exports = NoticiaDetalle;
