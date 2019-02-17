import React, { Component } from 'react';
import { Text, View, Button } from 'native-base';
import {
  TouchableOpacity,
  Modal,
  StatusBar,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import isEqual from 'lodash/isEqual';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DialogHeaderComponent from '../DialogHeaderComponent';

const { width, height } = Dimensions.get('window');

const styles = {
  headerBar: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#EEE'
  },
  imageListContainer: {
    borderRadius: 5,
    backgroundColor: '#CCC',
    margin: 5,
    overflow: 'hidden'
  },
  imageTileContainer: {
    borderRadius: 5,
    backgroundColor: '#CCC',
    margin: 5,
    overflow: 'hidden',
    height: width / 4,
    width: width / 4
  },
  displayButton: {
    marginLeft: 5,
    padding: 2.5,
    borderRadius: 2.5,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 2.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    borderColor: '#F33'
  }
};

class ImageViewer extends Component {
  static defaultProps = {
    assets: [],
    open: false,
    onClose: () => {},
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      display: 'list',
      assets: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.assets, prevState.assets)) {
      return {
        ...prevState,
        assets: nextProps.assets,
        newassets: nextProps.assets
      };
    }
    return { ...prevState };
  }

  onDone = () => {
    const { newassets } = this.state;
    this.props.onChange([...newassets]);
    this.props.onClose();
  };

  renderImageList = ({ item, index }) => (
    <View style={styles.imageListContainer}>
      <Image
        source={{ uri: item.Location }}
        style={{ height: width, width: '100%' }}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => this.removeAsset(item)}
      >
        <MaterialIcons name="close" size={16} color="#F33" />
      </TouchableOpacity>
    </View>
  );

  renderImageTiles = ({ item, index }) => (
    <View style={styles.imageTileContainer}>
      <Image
        source={{ uri: item.Location }}
        style={{ height: width / 4, width: '100%' }}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => this.removeAsset(item)}
      >
        <MaterialIcons name="close" size={16} color="#F33" />
      </TouchableOpacity>
    </View>
  );

  removeAsset = item => {
    const { assets } = this.state;
    const newassets = assets.filter(a => a.Location !== item.Location);
    this.setState({ newassets });
  };

  render() {
    const { open } = this.props;
    const { display, newassets } = this.state;

    const donebutton = (
      <Button
        transparent
        outline
        style={{ marginLeft: 5 }}
        onPress={this.onDone}
      >
        <Text style={{ color: '#33F' }}>Done</Text>
      </Button>
    );

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={open}
        onRequestClose={() => {}}
      >
        <StatusBar />
        <DialogHeaderComponent
          onClose={this.props.onClose}
          right={donebutton}
        />

        <View style={styles.headerBar}>
          <TouchableOpacity
            style={{
              borderWidth: display === 'list' ? 0.25 : 0,
              ...styles.displayButton
            }}
            onPress={() => this.setState({ display: 'list' })}
          >
            <Ionicons name="md-menu" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: display === 'tiles' ? 0.25 : 0,
              ...styles.displayButton
            }}
            onPress={() => this.setState({ display: 'tiles' })}
          >
            <AntDesign name="appstore1" size={18} />
          </TouchableOpacity>
        </View>

        {display === 'list' && (
          <Animatable.View delay={500} animation="zoomIn">
            <FlatList
              data={newassets}
              numColumns={1}
              renderItem={this.renderImageList}
              keyExtractor={(item, index) => item.id + index}
              onEndReached={() => {}}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={
                <Text style={{ margin: 5 }}>No media to display</Text>
              }
              initialNumToRender={10}
            />
          </Animatable.View>
        )}
        {display === 'tiles' && (
          <Animatable.View delay={500} animation="zoomIn">
            <FlatList
              data={newassets}
              numColumns={4}
              renderItem={this.renderImageTiles}
              keyExtractor={(item, index) => item.id + index}
              onEndReached={() => {}}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={
                <Text style={{ margin: 5 }}>No media to display</Text>
              }
              initialNumToRender={10}
            />
          </Animatable.View>
        )}
      </Modal>
    );
  }
}

export default ImageViewer;
