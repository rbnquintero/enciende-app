import React, {
  Component,
  TouchableHighlight,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  ScrollView,
  ListView,
  View
} from 'react-native';

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
  newsRendered,
} = require('../../actions');
type Props = {
  news: Noticias;
  user: User;
  loadNews: () => void;
  newsRendered: () => void;
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loadedNews: false,
    };
    this.props.loadNews();
    /*var finaldate = moment(new Date()).add(1, 'minutes').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    LocationReportingService.beginReportingLocation("3", "7", finaldate);
    /*LocationReportingService.getLocations((error, locations) => {
      if (error) {
        console.error(error);
      } else {
        console.log(locations);
      }
    });*/
  }

  _rowPressed(noticia) {
    this.props.navigator.push({
      title: "Noticia",
      name: 'NoticiaDetalle',
      component: NoticiaDetalle,
      passProps: {noticia: noticia}
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this._rowPressed(rowData)}>
        <Card data={rowData} />
      </TouchableHighlight>
    );
  }

  componentDidUpdate() {
    if(!this.props.news.isLoading && this.props.news.pendingRendering) {
      var dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      });
      this.setState({
        dataSource: dataSource.cloneWithRows(this.props.news.news)
      });
      this.props.newsRendered();
    }
  }

  render() {
    var list;
    if(this.state.dataSource != null) {
      list = (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      );
    } else {
      if(!this.props.news.isFetching && this.props.news.error != null) {
        list = (
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
            <TouchableHighlight style={{flex: 1}} onPress={() => {
              this.props.loadNews();
            }} >
              <View style={{flex:1, alignItems: 'center'}}>
                <Text style={{ textAlign: 'center', flex: 1 }}>Ocurrió un error al cargar las noticias.</Text>
                <Text style={{ textAlign: 'center', flex: 1 }}>Haz click aquí para reintentar.</Text>
              </View>
            </TouchableHighlight>
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
  };
}

module.exports = connect(select, actions)(Home);
