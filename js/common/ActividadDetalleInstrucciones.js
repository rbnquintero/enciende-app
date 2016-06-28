import React, {
  Component,
  Image,
  StyleSheet,
  TextInput,
  NetInfo,
  TouchableOpacity,
  View
} from 'react-native';
var {Text} = require('./Text');

var Loader = require('../../views/helpers/LoaderSmall');
var env = require('../../env');
var connectivity = require('connectivity')

const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog,
} = FBSDK;

const shareLinkContent = {
  contentType: 'photo',
  commonParameters:{
    hashtag:"#EnciendeCDMX",
  },
  photos: [
    {
      imageUrl: "./local/image/path.png",
      userGenerated: false,
      caption: ""
    }
  ]
};

var ImagePickerManager = require('NativeModules').ImagePickerManager;

/* REDUX */
import type {State as User} from '../../reducers/user';
import type {State as ActividadesUser} from '../../reducers/actividadesUser';
import type {State as Staff} from '../../reducers/staff';
import type {State as App} from '../../reducers/app';
var { connect } = require('react-redux');
var {
  validateActivity,
  actPushing,
  actPushingDone,
} = require('../../actions');
type Props = {
  user: User;
  actividadesUser: ActividadesUser;
  staff: Staff;
  app: App;
  validateActivity: () => void;
  actPushing: () => void;
  actPushingDone: () => void;
};

class ActividadDetalleInstrucciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desbloqCode: '',
      calificacion: '',
    };
  }

  submitSelfie(imageUri) {
    var info = {};
    info['actividades']=this.props.actividadesUser.actividades;
    info['staff']=this.props.staff.staff;
    info['action']='instrucciones';
    info['code']=env.validtoken;
    info['imageUri']=imageUri;
    info['actividad']=this.props.actividad;
    this.props.validateActivity(info);
  }

  render() {
    if (this.props.actividad.estatus < 30) {
      return null;
    }

    var buttonCamera = (
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.takePicture()} underlayColor='#99d9f4'>
        <Image style={{marginVertical: 10, width: 50, height: 50, resizeMode: Image.resizeMode.cover }} source={require('./img/camera.png')}/>
      </TouchableOpacity>
    );
    if (this.props.actividadesUser.isPushing && this.props.actividad.estatus == 30) {
      buttonCamera = (
        <View style={{marginVertical: 25}}>
          <Loader />
        </View>
      );
    }

    var foto = null;/*(
      <Image source={require('image!empty')} style={{ resizeMode: Image.resizeMode.cover, height: 200, alignSelf:'stretch' }}/>
    );
    if(imagenuri != null) {
      <Image source={{ uri: imagenuri }} style={{ resizeMode: Image.resizeMode.cover, height: 200, alignSelf:'stretch' }}/>
    }*/

    var desbloq = null;
    var okIcon = null;
    if(this.props.actividad.estatus == 30  && this.props.app.rallyOn) {
      desbloq = (
        <View>
          <Text style={ styles.texto }>
            {this.props.actividad.actividad.instrucciones}
          </Text>
          <Text style={ styles.texto }>
            Al terminar, toma tu selfie
          </Text>
          {buttonCamera}
        </View>
      );
    } else {
      if(this.props.actividad.estatus > 30) {
        okIcon = (
          <Image
            style={{ resizeMode: Image.resizeMode.contain, width: 15, height: 15, marginTop: 13 }}
            source={require('image!ok')}/>
        );
      }
      desbloq = (
        <View>
          <Text style={ styles.texto }>
            {this.props.actividad.actividad.instrucciones}
          </Text>
          {foto}
        </View>
      );
    }

    return (
      <View style={ styles.container }>
        <View style={{ flexDirection: 'row' }}>
          <Text style={ styles.titulo }>
            Instrucciones
          </Text>
          {okIcon}
        </View>
        {desbloq}
      </View>
    );
  }

  takePicture() {
    var _this = this;
    this.props.actPushing();
    var options = {
      title: 'Selecciona una foto', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Tomar foto...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Escoger de libería...', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      maxWidth: 2000, // photos only
      maxHeight: 2000, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.5, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    /**
    * The first arg will be the options object for customization, the second is
    * your callback which sends object: response.
    *
    * See the README for info about the response
    */

    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        _this.props.actPushingDone();
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        _this.props.actPushingDone();
        console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        // You can display the image using either data:
        _this.props.actPushing();
        var imageuri = response.uri;
        shareLinkContent.photos[0].imageUrl=imageuri;
        console.log(shareLinkContent);

        NetInfo.fetch().done((reach) => {
          console.log(reach);
          //Subir fotos solo por wifi
          if("WIFI"==reach||"wifi"==reach||"CELL"==reach||"cell"==reach||"MOBILE"==reach||"mobile"==reach){
            console.log('connected to the internet!')
            ShareDialog.canShow(shareLinkContent).then(
              function(canShow) {
                if (canShow) {
                  return ShareDialog.show(shareLinkContent);
                }else{
                  console.log("No se pudo compartir");
                  _this.submitSelfie(imageuri);
                }
              }
            ).then(
              function(result) {
                if (result.isCancelled) {
                  console.log('Share cancelled');
                } else {
                  _this.submitSelfie(imageuri);
                }
              },
              function(error) {
                console.log("Error al compartir "+error);
                console.log("Error al compartir "+imageuri);
                _this.submitSelfie(imageuri);
              }
            );
          } else {
            console.log("no hay internet");
            _this.submitSelfie(imageuri);
          }
        });
      }
    });
  }



}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1, borderColor: 'rgba(156,158,162,0.3)', paddingBottom: 10
  },
  titulo: {
    flex: 1, fontSize: 17, marginTop: 10, color: 'rgb(240,242,245)',
  },
  texto: {
    flex: 1, fontSize: 15, marginTop: 5, color: 'rgb(156,158,162)',
  },
  desbloqueoContainer: {
    flexDirection: 'row', flexWrap: 'wrap', marginVertical: 30,
  },
  desbloqueoInputContainer: {
    backgroundColor: 'white', paddingHorizontal: 5, marginRight: 10, backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: '#e6e6e6'
  },
  desbloqueoInput: {
    height: 35, width: 80, borderColor:'#cccccc',borderWidth: 1,borderRadius: 4, padding:7
  },
  desbloqueoBotonContainer: {
    height: 30,
  },
  desbloqueoBotonTextoContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
  },
  desbloqueoBotonTexto: {
    flex: 1, fontSize: 18, fontWeight: '200', color: '#3399ff',
  }
});

function select(store) {
  return {
    user: store.user,
    actividadesUser: store.actividadesUser,
    staff: store.staff,
    app: store.app,
  };
}

function actions(dispatch) {
  return {
    validateActivity: (info) => dispatch(validateActivity(info)),
    actPushing: () => dispatch(actPushing()),
    actPushingDone: () => dispatch(actPushingDone()),
  };
}

module.exports = connect(select, actions)(ActividadDetalleInstrucciones);
