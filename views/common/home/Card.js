import React, {
  Component,
  Image,
  Text,
  StyleSheet,
  View
} from 'react-native';

class Card extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  //<Image source={{uri: evento.urlImagen}} style={styles.newscontainerImage}/>

  render() {
    var evento = this.props.data;
    var fecha = evento.fechaNoticia;
    return (
      <View style={styles.newscontainer} ref={component => this._root = component} {...this.props}>
        <View style={styles.newscontainerImageContainer}>
          <Image source={ require("image!empty") } style={styles.newscontainerImage}/>
        </View>
        <Text style={styles.newscontainerTitulo}>{evento.titulo}</Text>
        <Text style={styles.newscontainerDate}>{fecha}</Text>
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
