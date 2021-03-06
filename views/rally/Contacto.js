import React, {
  Component,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');

var AppLogo = require('../segments/AppLogo');
var Header = require('../../js/common/HeaderHome');

/*  DATE */
var moment = require('moment');
var esLocale = require('moment/locale/es');

import BackPress from '../../js/common/BackPress';

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as Navigation} from '../../reducers/navigation';
var { connect } = require('react-redux');
var {
  toMainHome,
} = require('../../actions');
type Props = {
  user: User;
  navigation: Navigation;
  toMainHome: () => void;
};

class Contacto extends Component {
  componentDidMount() {
      this.backPress = new BackPress(this.props.appnavigator,this.props.drawer);
  }

  componentWillUnmount() {
    this.backPress.removeListener();
  }
  llamar(contacto) {
    Linking.canOpenURL('tel:'+contacto.telefono).then(supported => {
      if (supported) {
        Linking.openURL('tel:'+contacto.telefono);
      } else {
        console.log('Don\'t know how to open URI: ' + 'tel:'+contacto.telefono);
      }
    });
  }

  openMail() {
    Linking.canOpenURL('mailto:contacto@enciende.org').then(supported => {
      if (supported) {
        Linking.openURL('mailto:contacto@enciende.org');
      } else {
        console.log('Don\'t know how to open URI: ' + 'mailto:contacto@enciende.org');
      }
    });
  }


  render() {
    var _this = this;
    var contactos=[];
    var textContactos = null;

    if(this.props.user.isRegistered) {
      contactos = this.props.user.currentRally.grupo.rally.contactos;

      textContactos = (
        <Text style={{ marginTop: 25, marginBottom:20, fontSize: 20, fontWeight: '200', textAlign: 'center' }}>
          En caso de alguna emergencia durante el Rally, marca a cualquiera de las siguientes personas:
        </Text>
      )
    }


    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <Header
          title="Contacto"
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.openDrawer,
          }}/>
        <ScrollView>
          <View style={{ flex: 2, alignItems: 'center', marginHorizontal: 15 }}>
            <Text style={{ marginTop: 25, fontSize: 25, fontWeight: '200', textAlign: 'center' }} onPress={() => this.openMail()}>
              Envianos un correo a contacto@enciende.org
            </Text>
            {textContactos}
            {contactos.map(function(result, id){
              return (
                <TouchableOpacity key={id} onPress={() => _this.llamar(result)}  >
                  <Text style={{fontSize: 17, fontWeight: '200', textAlign: 'center', color: '#3399ff', marginVertical: 10}} >
                    {result.nombre}: {result.telefono}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

}

function select(store) {
  return {
    user: store.user,
    navigation: store.navigation,
  };
}

function actions(dispatch) {
  return {
    toMainHome: () => dispatch(toMainHome()),
  };
}



module.exports = connect(select, actions)(Contacto);
