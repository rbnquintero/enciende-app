import React, {
  Component,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StyleSheet,
  NativeModules,
  ScrollView,
  RefreshControl,
  ListView,
  View
} from 'react-native';
var {Text} = require('../../js/common/Text');

var Card = require('./home/Card');
var Loader = require('./../helpers/Loader');
var NoticiaDetalle = require('./NoticiaDetalle');
var Header = require('../../js/common/Header');
var moment = require('moment');

var env = require('../../env');
var LocationReportingService = NativeModules.LocationReportingService;

/* REDUX */
import type {State as Noticias} from '../../reducers/noticia';
import type {State as User} from '../../reducers/user';
var { connect } = require('react-redux');
var {
  loadNews,
  fetchProfile,
  newsRendered,
} = require('../../actions');
type Props = {
  news: Noticias;
  user: User;
  loadNews: () => void;
  newsRendered: () => void;
  fetchProfile: () => void;
  fetchAll: () => void;
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedNews: false,
    };
    this.props.loadNews();
  }

  _rowPressed(noticia) {
    this.props.navigator.push({
      title: "Noticia",
      name: 'NoticiaDetalle',
      component: NoticiaDetalle,
      passProps: {noticia: noticia}
    });
  }

  render() {
    var _this = this;
    var rallyBar = null;
    if(this.props.user.isLoggedIn && this.props.user.currentRally!=null) {
      rallyBar = (
        <View style={{height:35, backgroundColor: 'rgba(0,0,0,0)'}}/>
      );
    }

    var list;
    if(this.props.news.news != null) {
      list = (
        <ScrollView
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          refreshControl={
            <RefreshControl
              refreshing={this.props.news.isFetching}
              onRefresh={this.props.fetchAll}
              tintColor='rgba(255,255,255,0.7)'
            />
          }>
          {this.props.news.news.map(function(result, id){
            return (
              <TouchableHighlight key={id} onPress={() => _this._rowPressed(result)}>
                <Card data={result} />
              </TouchableHighlight>
            );
          })}
          {rallyBar}
        </ScrollView>
      );
    } else {
      if(!this.props.news.isFetching && this.props.news.error != null) {
        list = (
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => {
              this.props.loadNews();
            }} >
              <View style={{flex:1, alignItems: 'center'}}>
                <Text style={{ textAlign: 'center', flex: 1 }}>Ocurrió un error al cargar las noticias.</Text>
                <Text style={{ textAlign: 'center', flex: 1 }}>Haz click aquí para reintentar.</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else {
        list = (
          <Loader />
        );
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          title="Noticias enciende"
          leftItem={{
            layout: 'icon',
            title: 'Menu',
            icon: require('../../js/common/img/hamburger.png'),
            onPress: this.props.navigator.props.openDrawer,
          }}/>
        <View style={{ flex: 1 }}>
          {list}
        </View>
      </View>
    );
  }
}

function select(store) {
  return {
    news: store.news,
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    loadNews: () => dispatch(loadNews()),
    newsRendered: () => dispatch(newsRendered()),
    fetchProfile: () => dispatch(fetchProfile()),
    fetchAll: () => {dispatch(loadNews()); dispatch(fetchProfile())},
  };
}

module.exports = connect(select, actions)(Home);
