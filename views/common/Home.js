import React, {
  Component,
  TouchableHighlight,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ListView,
  View
} from 'react-native';

var Card = require('./home/Card');
var Loader = require('./../helpers/Loader');
var NoticiaDetalle = require('./NoticiaDetalle');

var env = require('../../env');

/* REDUX */
import type {State as Noticias} from '../../reducers/noticia';
var { connect } = require('react-redux');
var {
  loadNews,
} = require('../../actions');
type Props = {
  news: Noticias;
  loadNews: () => void;
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loadedNews: false,
    };
    this._fetchNews();
  }

  _rowPressed(noticia) {
    console.log(noticia);
    this.props.navigator.push({
      title: "Noticia",
      name: 'NoticiaDetalle',
      component: NoticiaDetalle,
      passProps: {noticia: noticia}
    });
  }

  _fetchNews() {
    var _this = this;
    var query = env.serverURL + "/noticias/lista/10/10";
    fetch(query)
      .then(response => response.json())
      .then(json => {
        console.log("data", json);
        var dataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        _this.setState({
          dataSource: dataSource.cloneWithRows(json.noticias)
        });
      }).catch(error => {
        console.log(error);
        _this.setState({
          errorLoading: true
        });
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

  }

  render() {
    var list;
    console.log("datasource", this.state.dataSource);
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
      <View style={{ flex: 1, marginTop: 64 }}>
        {list}
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
    textAlign: 'center',
  }
});

function select(store) {
  return {
    news: store.news,
  };
}

function actions(dispatch) {
  return {
    loadNews: () => dispatch(loadNews()),
  };
}

module.exports = connect(select, actions)(Home);
