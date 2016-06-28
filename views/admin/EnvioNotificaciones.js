import React, {
  Component,
  Platform,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

var Loader = require('../helpers/Loader');
var env = require('../../env');
var RegistroUsuarioResultado = require('./RegistroUsuarioResultado');
var Header = require('../../js/common/HeaderHome');
var t = require('tcomb-form-native');


import BackPress from '../../js/common/BackPress';
import AccordionPicker from '../../js/component/AccordionPicker';


/* REDUX */
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
type Props = {
  user: User;
};
class EnvioNotificaciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notificacionEnviada:false,
      errorAlEnviar:false,
      errorLoading: false,
    };
  }

  componentDidMount() {
      this.backPress = new BackPress(this.props.appnavigator,this.props.drawer);
      this.loadTopics();
  }

  componentWillUnmount() {
    this.backPress.removeListener();
  }

  loadTopics() {
    var topics =
      [
        {
          descripcion:"A todos",
          nombre:"/topics/general"
        }
      ];

    var rally = this.props.user.currentRally.grupo.rally;
    var query = env.serverURL + '/rally/topics/' + rally.idRally;
    fetch(query)
      .then(response => response.json())
      .then(json => {
        if(json.success == true) {
          for (var i = 0; i < json.topics.length; i++) {
              topics.push(json.topics[i]);
          }
          this.setState({isLoading: false,topics: topics});
        } else {
          console.log(json.error);
          this.setState({
            errorLoading: true
          });
        }
      }).catch(error => {
        console.log(error);
        this.setState({
          errorLoading: true
        });
      });
    this.setState({isLoading: false,topics: topics});
  }

  setLoadingTrue() {
    this.setState({isLoading: true,errorAlEnviar:false});
  }

  enviarNotificacion(form) {
    var query = env.gcmUrl;
    form = this.refs.form.getValue();
    var data = {
      notification:{
        title:form.titulo,
        body:form.mensaje,
        sound:'default',
        color: "#9D0ED6",
        icon: "sysicon",
        vibrate:'true'
      },
      priority:'high',
      to:form.aQuien
    };
    this.setLoadingTrue();
    fetch(query,
      {
        method:'POST',
        body:JSON.stringify(data),
        headers:{
          'Authorization': 'key='+env.gcmKey,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => response.json()).then(json => {
      if(json.message_id) {
        this.setState({isLoading: false, notificacionEnviada: true,errorAlEnviar:false});
      } else {
        console.log(json.error);
        this.setState({errorAlEnviar: true});
      }
    }).catch(error => {
      console.log(error);
      this.setState({errorAlEnviar: true});
    });
  }

  render() {
    var view = null;
    var viewExito = null;
    if(this.state.isLoading){
      view = (<Loader caption="Cargando..."/>);
    } else {

      var Form = t.form.Form;


      var topicsMaps = {};


      for(var i=0;i<this.state.topics.length;i++){
        topicsMaps[this.state.topics[i].nombre]=this.state.topics[i].descripcion;
      }
      var Topic = t.enums(topicsMaps);
      var formOptions;
      if(Platform.OS === 'ios'){
        formOptions = {
          fields:{
            mensaje:{
              multiline:true,
              numberOfLines:4,
              stylesheet:customTxtBox
            },
            aQuien:{
              template: (data) => (
                  <AccordionPicker
                      defaultValue={data.options.find((o) => o.value === data.value)}
                      onChange={data.onChange}
                      options={data.options}
                      data={data}
                  />
              )
            }
          }
        };
      }else{
        formOptions = {
          fields:{
            mensaje:{
              multiline:true,
              numberOfLines:4,
              stylesheet:customTxtBox
            }
          }
        };
      }

      // here we are: define your domain model
      var NotificacionForm = t.struct({
        titulo: t.String,
        mensaje: t.String,
        aQuien: Topic,
      });

      if(this.state.notificacionEnviada){
        viewExito = (
          <Text style={{ fontSize: 12, fontWeight: '200', marginTop: 20, color:'#32CD32' }}>
            Notificacion enviada con éxito
          </Text>
        );
      }else if(this.state.errorAlEnviar){
        viewExito = (
          <Text style={{ fontSize: 12, fontWeight: '200', marginTop: 20, color:'#DC143C' }}>
            Hubo un error al enviar la noticación, intenta más tarde.
          </Text>
        );
      }
      view = (
      <ScrollView >
        <View style={styles.container}>
          <Text style={{ fontSize: 17, fontWeight: '200', marginTop: 20}}>
            Datos de la notificación a enviar
          </Text>
          {viewExito}
        </View>
        <View style={styles.container}>
          <Form
            ref="form"
            type={NotificacionForm}
            options={formOptions}
          />
          <TouchableHighlight style={styles.button} onPress={() => this.enviarNotificacion()} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Enviar notificación</Text>
          </TouchableHighlight>
        </View>

      </ScrollView>);
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <Header
          title="Envío de notificaciones"
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.openDrawer,
          }}/>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop:10
  },
});

var LABEL_COLOR = '#000000';
var INPUT_COLOR = '#000000';
var ERROR_COLOR = '#a94442';
var HELP_COLOR = '#999999';
var BORDER_COLOR = '#cccccc';
var DISABLED_COLOR = '#777777';
var DISABLED_BACKGROUND_COLOR = '#eeeeee';
var FONT_SIZE = 17;
var FONT_WEIGHT = '500';
var customTxtBox = Object.freeze({
  formGroup: {
    normal: {
      marginBottom: 10
    },
    error: {
      marginBottom: 10
    }
  },
  controlLabel: {
    normal: {
      color: LABEL_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT
    },
    // the style applied when a validation error occours
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 2
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 2
    }
  },
  errorBlock: {
    fontSize: FONT_SIZE,
    marginBottom: 2,
    color: ERROR_COLOR
  },
  textbox: {
    normal: {
      color: '#000000',
      fontSize: 17,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderColor: '#cccccc',
      borderWidth: 1,
      marginBottom: 5,
      height:100,
      textAlignVertical: "top"
    },
    // the style applied when a validation error occours
    error: {
      color: '#000000',
      fontSize: 17,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderColor: '#a94442',
      borderWidth: 1,
      marginBottom: 5,
      height:100,
      textAlignVertical: "top"
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: 17,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderColor: '#cccccc',
      borderWidth: 1,
      marginBottom: 5,
      color: '#777777',
      backgroundColor: '#eeeeee',
      height:100,
      textAlignVertical: "top"
    }
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {

  };
}

module.exports = connect(select,actions)(EnvioNotificaciones);
