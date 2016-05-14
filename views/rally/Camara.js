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
      view = (<Loader caption="Cargando grupos"/>);
    } else{
      view =(<View style={styles.container}>

        <View>
          <View style={ styles.barraCamara }>
            <Text style={styles.espacio}></Text>
            <View style={{flex:1,height:55,justifyContent: 'center',alignItems: 'center'}}>
              <TouchableHighlight onPress={this.takePicture.bind(this)} >
                <Image source={ require('../../img/icon/camera.png')}  style={styles.botonCamara}/>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </View>);
    }

    return view;
  }


  takePicture() {




    var options = {
      title: 'Select Avatar', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      customButtons: {
        'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
      },
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
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
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

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
            if (result.isCancelled) {
              alert('Share cancelled');
            } else {
              alert('Share success with postId: '
                + result.postId);
            }
          },
          function(error) {
            alert('Share fail with error: ' + error);
          }
        );

        this.setState({
          avatarSource: source
        });
      }
    });



  }
}

const styles = StyleSheet.create({
  barraCamara:{
      backgroundColor:'#81c04d',
      flexDirection:'row' ,
      height:60
  },
  espacio:{
      width: 50
  },
  botonCambiarCamara:{
      width: 100,
      resizeMode: Image.resizeMode.contain,
      height:40
  },
  botonCamara:{
      flex:1,
      resizeMode: Image.resizeMode.contain,
      height:55
  },
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
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
