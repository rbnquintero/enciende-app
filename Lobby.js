import React, {
  Component,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
  ScrollView,
  View
} from 'react-native';

var RegistroUsuarios = require('./RegistroUsuarios');

class Lobby extends Component {
  _navigate(dest) {
    var destComponent;
    var destTitle;
    if(dest == 'RegistroUsuarios') {
      destComponent = RegistroUsuarios;
      destTitle = 'Registro de Usuarios';
    }
    this.props.navigator.push({
        name: dest,
        title: destTitle,
        component: destComponent,
        passProps: {}
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Image source={require('image!empty')} style={styles.profPic} />
          <View style={styles.profData}>
            <Text style={styles.profId}>
              Some
            </Text>
            <Text style={styles.profTitle}>
              Nombre
            </Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1, marginTop: 30 }}>
          <View style={styles.scroll}>
            <TouchableHighlight onPress={ () => this._navigate('RegistroUsuarios') }>
              <View style={styles.option}>
                <Text style={styles.optiontext} >
                  Registro
                </Text>
              </View>
            </TouchableHighlight>
            <View style={styles.option}>
              <Text style={styles.optiontext}>
                Option
              </Text>
            </View>
            <View style={styles.option}>
              <Text style={styles.optiontext}>
                Option
              </Text>
            </View>
            <View style={styles.option}>
              <Text style={styles.optiontext}>
                Option
              </Text>
            </View>
            <View style={styles.option}>
              <Text style={styles.optiontext}>
                Option
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
    //borderWidth: 2,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center'
  },
  option: {
    borderWidth: 5,
    borderColor: '#FFFFFF',
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 180
  },
  optiontext: {
    width: 100,
    fontSize: 15,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  scroll: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  profPic: {
    flex: 1,
    height: 80,
    resizeMode: Image.resizeMode.contain
  },
  profData: {
    flex: 2,
    marginLeft: 20
  },
  profTitle: {
    fontSize: 35,
    fontWeight: 'bold'
  },
  grayText: {
    color: '#333333'
  },
  profId: {
    fontSize: 15
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

module.exports = Lobby;
