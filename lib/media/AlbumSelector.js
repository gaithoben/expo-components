import React, { Component } from 'react';
import { View, Text, TouchableHighlight, FlatList, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import isEqual from 'lodash/isEqual';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    padding: 10,
    backgroundColor: '#FFFCCC'
  },
  listItem: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#CCC',
    paddingVerical: 10
  },
  albumInfo: {
    marginLeft: 20
  }
};

class AlbumSelector extends Component {
  static defaultProps = {
    onSelect: () => {},
    albums: []
  };

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      albums: [],
      selected: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      !isEqual(prevState.albums, nextProps.albums)
      && nextProps.albums.length > 0
    ) {
      return { ...prevState, albums: nextProps.albums };
    }
    return { ...prevState };
  }

  renderListItem = ({ item }) => {
    const media = item.media || {};
    const uri = media.uri || null;

    return (
      <TouchableHighlight
        key={item.name}
        onPress={() => this.props.onSelect(item)}
      >
        <View style={styles.listItem}>
          <Image
            source={{ uri: uri || './assets/no_available_image.png' }}
            style={{ width: 60, height: 60 }}
          />
          <View style={styles.albumInfo}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ fontSize: 12, color: '#555', marginTop: 5 }}>
              {item.assetCount}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <Animatable.View animation="slideInUp" style={styles.root}>
        <FlatList
          data={this.state.albums}
          renderItem={this.renderListItem}
          keyExtractor={(item, index) => `${index}-${item.name}`}
          ListEmptyComponent={<Text>Getting albums...</Text>}
          initialNumToRender={24}
        />
      </Animatable.View>
    );
  }
}

export default AlbumSelector;
