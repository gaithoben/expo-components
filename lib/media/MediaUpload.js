import React, { Component, Fragment } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Image
} from 'react-native';
import { Toast } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import * as Animatable from 'react-native-animatable';
import ImageViewer from 'cloudhub-expo-components/lib/media/ImageViewer';
import MediaSelector from './MediaSelector';
import ImageDisplay from './ImageDisplay';
import CameraScreen from './CameraScreen';
import VideoScreen from './video/VideoScreen';

const { width } = Dimensions.get('window');

class MediaUpload extends Component {
  static defaultProps = {
    mediaType: ['photo', 'video'],
    endpoint: '/fileapi/upload/image',
    allowRemove: true,
    showAddButton: true,
    input: {
      value: {},
      onChange: () => {}
    },
    value: {},
    onChange: () => {},
    limit: 1,
    placeholderImage: null,
    resize: true
  };

  constructor(props) {
    super(props);
    this.state = {
      openselector: false,
      selectedButton: props.mediaType.includes('photo') ? 'Library' : 'Video',
      selectedAssets: [],
      showimageviewer: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const value = nextProps.input.value || nextProps.value;
    if (!isEqual(value, prevState.value)) {
      if (!isEmpty(value)) {
        if (Array.isArray(value)) {
          return {
            ...prevState,
            selectedAssets: [...value],
            value
          };
        }
        return { ...prevState, selectedAssets: [value], value };
      }
      return { ...prevState, selectedAssets: [], value };
    }
    return { ...prevState };
  }

  componentDidMount() {}

  onAddMedia = () => {
    this.setState({ openselector: true });
  };

  onCancel = () => {
    this.setState({ openselector: false });
  };

  onSelectOne = selectedAsset => {
    this.setState({ selectedAssets: [selectedAsset] });
  };

  onSelectMany = selectedAssets => {
    this.setState({ selectedAssets });
  };

  onUpload = selectedAssets => {
    if (selectedAssets.length > 0) {
      if (this.props.limit === 1) {
        this.props.onChange(selectedAssets[0]);
        this.props.input.onChange(selectedAssets[0]);
      } else {
        this.props.onChange(selectedAssets);
        this.props.input.onChange(selectedAssets);
      }
    } else {
      this.props.onChange([]);
      this.props.input.onChange([]);
    }
  };

  onPressImageDisplay = (selectedAssets, uploading) => {
    if (uploading) {
      return Toast.show({
        text: 'Please wait for the upload to complete'
      });
    }
    this.setState({ showimageviewer: true });
  };

  render() {
    const { selectedButton, selectedAssets, showimageviewer } = this.state;
    const { showAddButton, allowRemove, placeholderImage, resize } = this.props;

    const currentCount = selectedAssets.length;

    const uriind = selectedAssets.findIndex(a => Boolean(a.uri));
    let uploading = false;
    if (uriind !== -1) {
      uploading = true;
    }

    return (
      <View style={styles.root}>
        {selectedAssets.length === 0 && (
          <View style={styles.noImage}>
            {placeholderImage && (
              <View style={styles.placeholderImage}>
                <Image
                  source={placeholderImage}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
            )}
            {showAddButton && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={this.onAddMedia}
              >
                <MaterialIcons name="add" size={24} />
              </TouchableOpacity>
            )}
          </View>
        )}
        {selectedAssets.length > 0 && !showimageviewer && (
          <TouchableHighlight
            style={styles.profilePic}
            onPress={() => this.onPressImageDisplay(selectedAssets, uploading)}
          >
            <ImageDisplay
              assets={selectedAssets}
              onUpload={this.onUpload}
              endpoint={this.props.endpoint}
              allowRemove={allowRemove}
              resize
            />
          </TouchableHighlight>
        )}

        {showimageviewer && !uploading && (
          <ImageViewer
            open={showimageviewer}
            assets={selectedAssets}
            onClose={() => this.setState({ showimageviewer: false })}
            onChange={this.onUpload}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.openselector}
          onRequestClose={() => {}}
        >
          <StatusBar hidden barStyle="light-content" />

          {selectedButton === 'Library' && (
            <MediaSelector
              onCancel={this.onCancel}
              onSelectOne={this.onSelectOne}
              onSelectMany={this.onSelectMany}
              mediaType={this.props.mediaType}
              limit={this.props.limit - currentCount}
            />
          )}
          {selectedButton === 'Photo' && (
            <CameraScreen
              onCancel={() => this.setState({ openselector: false })}
              onSelectOne={this.onSelectOne}
            />
          )}

          {selectedButton === 'Video' && (
            <VideoScreen
              onCancel={() => this.setState({ openselector: false })}
              onSelectOne={this.onSelectOne}
            />
          )}

          <View style={styles.footer}>
            {this.props.mediaType.includes('photo') && (
              <Fragment>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selectedButton: 'Library' });
                  }}
                >
                  <Text
                    style={[
                      styles.footerButton,
                      selectedButton === 'Library' && { color: '#333' }
                    ]}
                  >
                    Library
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selectedButton: 'Photo' });
                  }}
                >
                  <Text
                    style={[
                      styles.footerButton,
                      selectedButton === 'Photo' && { color: '#333' }
                    ]}
                  >
                    Photo
                  </Text>
                </TouchableOpacity>
              </Fragment>
            )}

            {this.props.mediaType.includes('video') && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ selectedButton: 'Video' });
                }}
              >
                <Text
                  style={[
                    styles.footerButton,
                    selectedButton === 'Video' && { color: '#333' }
                  ]}
                >
                  Video
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: {
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#555',
    borderRadius: 2.5,
    backgroundColor: '#FFFCFF'
  },
  header: {
    paddingHorizontal: 10,
    height: 45,
    borderBottomWidth: 0.5,
    borderColor: '#001529',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    color: '#001529'
  },
  albumSelect: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    paddingHorizontal: 10,
    height: 45,
    borderTopWidth: 0.3,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footerButton: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#CCC'
  },
  profilePic: {
    width: '100%',
    height: width,
    position: 'relative',
    backgroundColor: 'rgba(52,52,52,0)',
    borderColor: '#CCC',
    borderWidth: 0.3,
    borderRadius: 5,
    overflow: 'hidden'
  },
  noImage: {
    width: '100%',
    height: width,
    position: 'relative',
    borderWidth: 0.3,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploaderContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  placeholderImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden'
  }
});

export default MediaUpload;
