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
var LocalDBUtil = require('./../utils/LocalDBUtil');

class Home extends Component {
  constructor(props) {
    super(props);
    this._fetchNews();
    this.state = {
      dataSource: null,
      errorLoading: false,
      some: "some",
      localDBUtil: new LocalDBUtil()
    };
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
    var query = "http://10.25.29.26:8080/noticias/";
    fetch(query)
      .then(response => response.json())
      .then(json => {
        console.log("data", json);
        var dataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        _this.state.localDBUtil.someTest();
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
      if(this.state.errorLoading) {
        list = (
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
            <TouchableHighlight style={{flex: 1}} onPress={() => {
              this.setState({
                errorLoading: false
              });
              this._fetchNews();
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

module.exports = Home;
