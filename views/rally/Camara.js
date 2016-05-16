'use strict';
import React, {
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog,
} = FBSDK;

const shareLinkContent = {
  contentType: 'photo',
  commonParameters:{
    hashtag:"#enciendemx",
  },
  photos: [
    {
      imageUrl: "./local/image/path.png",
      userGenerated: false,
      caption: ""
    }
  ]
};

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

var Loader = require('../helpers/Loader');
var ImagePickerManager = require('NativeModules').ImagePickerManager;


class Camara extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  render() {
    var view = null;
    if(this.state.isLoading) {
      view = (<Loader caption="Cargando..."/>);
    } else{
      view =(
        <View>
          <TouchableHighlight style={styles.button} onPress={() => this.takePicture()} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Tomar selfie</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return view;
  }


  takePicture() {
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
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
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
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        this.setState({isLoading:true});
        shareLinkContent.photos[0].imageUrl=response.uri;
        console.log(shareLinkContent);
        ShareDialog.canShow(shareLinkContent).then(
          function(canShow) {
            if (canShow) {
              return ShareDialog.show(shareLinkContent);
            }
          }
        ).then(
          function(result) {
            this.setState({isLoading:false});
            if (result.isCancelled) {
              alert('Share cancelled');
            }
          },
          function(error) {
            alert('Share fail with error: ' + error);
          }
        );
      }
    });
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
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
module.exports = connect(select, actions)(Camara);
