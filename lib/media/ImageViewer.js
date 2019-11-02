import React, { Component } from 'react';
import { View } from 'native-base';
import {
  TouchableOpacity,
  Modal,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import isEqual from 'lodash/isEqual';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '../Button';
import Text from '../Text';
import Header from '../Header';
import { colors, sizes } from '../theme';
import IconButton from '../IconButton';
import Block from '../Block';
import Badge from '../Badge';
import ThemeContext from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const styles = {
  headerBar: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#EEE',
  },
  imageListContainer: {
    borderRadius: 5,
    backgroundColor: '#CCC',
    margin: 5,
    overflow: 'hidden',
  },
  imageTileContainer: {
    borderRadius: 5,
    backgroundColor: '#CCC',
    margin: 5,
    overflow: 'hidden',
    height: width / 4,
    width: width / 4,
  },
  displayButton: {
    marginLeft: 5,
    padding: 2.5,
    borderRadius: 2.5,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
};

class ImageViewer extends Component {
  static defaultProps = {
    assets: [],
    open: false,
    onClose: () => {},
    onChange: () => {},
    onAddImage: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      display: 'list',
      assets: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.assets, prevState.assets)) {
      return {
        ...prevState,
        assets: nextProps.assets,
        newassets: nextProps.assets,
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
      <Block flex={false} style={styles.removeButton}>
        <IconButton
          color={colors.danger}
          onPress={() => this.removeAsset(item)}
          size={32}
        >
          <MaterialIcons name="close" size={24} color={colors.milkyWhite} />
        </IconButton>
      </Block>
    </View>
  );

  renderImageTiles = ({ item, index }) => (
    <View style={styles.imageTileContainer}>
      <Image
        source={{ uri: item.Location }}
        style={{ height: width / 4, width: '100%' }}
      />
      <Block flex={false} style={styles.removeButton}>
        <IconButton
          color={colors.danger}
          onPress={() => this.removeAsset(item)}
          size={24}
        >
          <MaterialIcons name="close" size={16} color={colors.milkyWhite} />
        </IconButton>
      </Block>
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

    const DoneButton = () => (
      <Button
        transparent
        outline
        onPress={this.onDone}
        style={{ marginRight: -sizes.base }}
      >
        <Text success h5 bold cropped>
          Save
        </Text>
      </Button>
    );

    return (
      <ThemeContext.Consumer>
        {({ colors, sizes }) => (
          <Modal
            animationType="slide"
            transparent={false}
            visible={open}
            onRequestClose={() => {}}
          >
            <Header
              onClose={this.props.onClose}
              rightComponent={() => <DoneButton />}
              style={{ height: 45 }}
              middle
            />

            <View style={styles.headerBar}>
              <TouchableOpacity
                style={{
                  borderWidth: display === 'list' ? 0.25 : 0,
                  ...styles.displayButton,
                }}
                onPress={() => this.setState({ display: 'list' })}
              >
                <Ionicons name="md-menu" size={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: display === 'tiles' ? 0.25 : 0,
                  ...styles.displayButton,
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
                  keyExtractor={(item, index) => `${index}-${item.id}`}
                  onEndReached={() => {}}
                  onEndReachedThreshold={0.5}
                  ListEmptyComponent={
                    <Block flex={false} padding={sizes.padding}>
                      <Block flex={false} center>
                        <Text style={{ margin: 5 }}>No media to display</Text>
                      </Block>
                      <Block row center>
                        <Button
                          rounded
                          color={colors.primary}
                          onPress={() => {
                            this.onDone();
                            this.props.onAddImage();
                          }}
                        >
                          <Text milkyWhite h5 cropped>
                            Add Image
                          </Text>
                        </Button>
                      </Block>
                    </Block>
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
                  keyExtractor={(item, index) => `${index}-${item.id}`}
                  onEndReached={() => {}}
                  onEndReachedThreshold={0.5}
                  ListEmptyComponent={
                    <Block flex={false} padding={sizes.padding}>
                      <Block flex={false} center>
                        <Text style={{ margin: 5 }}>No media to display</Text>
                      </Block>
                      <Block row center>
                        <Button
                          rounded
                          color={colors.primary}
                          onPress={() => {
                            this.onDone();
                            this.props.onAddImage();
                          }}
                        >
                          <Text milkyWhite h5 cropped>
                            Add Image
                          </Text>
                        </Button>
                      </Block>
                    </Block>
                  }
                  initialNumToRender={10}
                />
              </Animatable.View>
            )}
          </Modal>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default ImageViewer;
