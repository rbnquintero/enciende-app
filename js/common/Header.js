import React, {
  Component,
  TouchableOpacity,
  ToolbarAndroid,
  Platform,
  Image,
  StyleSheet,
  View
} from 'react-native';

var Colors = require('./Colors');
var {Text} = require('./Text');

export type Layout =
    'default'      // Use platform defaults (icon on Android, text on iOS)
  | 'icon'         // Always use icon
  | 'title';       // Always use title

export type Foreground = 'light' | 'dark';

export type Item = {
  title?: string;
  icon?: number;
  layout?: Layout;
  onPress?: () => void;
};

export type Props = {
  title: string;
  leftItem?: Item;
  rightItem?: Item;
  extraItems?: Array<Item>;
  foreground?: Foreground;
  style: any;
  children: any;
};

class HeaderAndroid extends Component {
  props: Props;

  render() {
    const {leftItem, rightItem, extraItems} = this.props;
    let actions = [];
    if (rightItem) {
      const {title, icon, layout} = rightItem;
      actions.push({
        icon: layout !== 'title' ? icon : undefined,
        title: title,
        show: 'always',
      });
    }
    if (extraItems) {
      actions = actions.concat(extraItems.map((item) => ({
        title: item.title,
        show: 'never',
      })));
    }

    const textColor = this.props.foreground === 'dark'
      ? Colors.darkText
      : 'white';

    let content;
    if (React.Children.count(this.props.children) > 0) {
      content = (
        <View collapsable={false} style={{flex: 1}}>
          {this.props.children}
        </View>
      );
    }

    return (
      <View style={[styles.toolbarContainer, this.props.style]}>
        <ToolbarAndroid
          navIcon={leftItem && leftItem.icon}
          onIconClicked={leftItem && leftItem.onPress}
          title={this.props.title}
          titleColor={textColor}
          subtitleColor={textColor}
          actions={actions}
          onActionSelected={this.handleActionSelected.bind(this)}
          style={styles.toolbar}>
          {content}
        </ToolbarAndroid>
      </View>
    );
  }

  handleActionSelected(position: number) {
    let items = this.props.extraItems || [];
    if (this.props.rightItem) {
      items = [this.props.rightItem, ...items];
    }
    const item = items[position];
    item && item.onPress && item.onPress();
  }
}

class HeaderIOS extends Component {
  props: Props;

  render() {
    const {leftItem, title, rightItem, foreground, background} = this.props;
    const titleColor = foreground === 'dark' ? Colors.darkText : 'white';
    const itemsColor = foreground === 'dark' ? Colors.lightText : 'white';

    const content = React.Children.count(this.props.children) === 0
      ? <Text style={[styles.titleText, {color: titleColor}]}>
          {title}
        </Text>
      : this.props.children;
    return (
      <View style={{alignSelf: 'stretch'}}>
        <View style={[styles.header, this.props.style, background]}>
          <View style={styles.leftItem}>
            <ItemWrapperIOS color={itemsColor} item={leftItem} />
          </View>
          <View
            accessible={true}
            accessibilityLabel={title}
            accessibilityTraits="header"
            style={[styles.centerItem,]}>
            {content}
          </View>
          <View style={styles.rightItem}>
            <ItemWrapperIOS color={itemsColor} item={rightItem} />
          </View>
        </View>
      </View>
    );
  }

}

class ItemWrapperIOS extends Component {
  props: {
    item: Item;
    color: string;
  };

  render() {
    const {item, color} = this.props;
    if (!item) {
      return null;
    }

    let content;
    const {title, icon, layout, onPress, iconstyle} = item;

    if (layout !== 'icon' && title) {
      content = (
        <Text style={[styles.itemText, {color}]}>
          {title.toUpperCase()}
        </Text>
      );
    } else if (icon) {
      content = <Image source={icon} style={iconstyle}/>;
    }

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        accessibilityTraits="button"
        onPress={onPress}
        style={styles.itemWrapper}>
        {content}
      </TouchableOpacity>
    );
  }
}

var STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;
var HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + STATUS_BAR_HEIGHT : 56 + STATUS_BAR_HEIGHT;

var styles = StyleSheet.create({
  toolbarContainer: {
    paddingTop: STATUS_BAR_HEIGHT,
    backgroundColor: 'rgb(140,51,204)',
  },
  toolbar: {
    height: HEADER_HEIGHT - STATUS_BAR_HEIGHT,
  },
  header: {
    backgroundColor: 'rgb(140,51,204)',
    paddingTop: STATUS_BAR_HEIGHT,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontFamily: 'Source Sans Pro',
    fontSize: 17,
    flex: 1
  },
  leftItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerItem: {
    alignItems: 'center',
  },
  rightItem: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemWrapper: {
    padding: 15,
  },
  itemText: {
    letterSpacing: 1,
    fontSize: 12,
    color: 'white',
  },
});

const Header = Platform.OS === 'ios' ? HeaderIOS : HeaderAndroid;
Header.height = HEADER_HEIGHT;

module.exports = Header;
module.exports.__cards__ = (define) => {
  const menuItem = {
    title: 'Menu',
    icon: require('./img/hamburger.png'),
    onPress: () => alert('Menu button pressed!'),
  };
  const filterItem = {
    title: 'Filter',
    icon: require('./img/filter.png'),
    onPress: () => alert('Filter button pressed!'),
  };

  define('Simple', () => <Header title="Hello, world" />);
  define('With items', () => (
    <Header
      title="Default"
      leftItem={menuItem}
      rightItem={filterItem}
    />
  ));
  define('Forcing icons', () => (
    <Header
      title="Forcing icons"
      leftItem={{...menuItem, layout: 'icon'}}
      rightItem={{...filterItem, layout: 'icon'}}
    />
  ));
  define('Forcing title', () => (
    <Header
      title="Forcing title"
      leftItem={{...menuItem, layout: 'title'}}
      rightItem={{...filterItem, layout: 'title'}}
    />
  ));
  define('With content', () => (
    <Header leftItem={menuItem}>
      <View style={{backgroundColor: '#224488'}}>
        <Text style={{color: 'yellow'}}>
          Yellow text as title
        </Text>
      </View>
    </Header>
  ));
  define('With Background', () => (
    <Header
      title="With Background"
      leftItem={{...menuItem, layout: 'title'}}
      rightItem={{...filterItem, layout: 'title'}}
      style={{backgroundColor: '#224488'}}
    />
  ));
  define('With light background', () => (
    <Header
      title="Light Background"
      leftItem={{...menuItem, layout: 'title'}}
      rightItem={{...filterItem, layout: 'title'}}
      style={{backgroundColor: 'white'}}
      foreground="dark"
    />
  ));
};
