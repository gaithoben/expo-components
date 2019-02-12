import React, { Component, Fragment } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MediaSelector from './MediaSelector';
import ImageDisplay from './ImageDisplay';
import CameraScreen from './CameraScreen';
import VideoScreen from './video/VideoScreen';

const { width } = Dimensions.get('window');

class MediaUpload extends Component {
  static defaultProps = {
    mediaType: ['photo', 'video'],
    endpoint: `/fileapi/upload/image`,
  };

  constructor(props) {
    super(props);
    this.state = {
      openselector: false,
      selectedButton: props.mediaType.includes('photo') ? 'Library' : 'Video',
      selectedAssets: [],
    };
  }

  onCancel = () => {
    this.setState({ openselector: false });
  };

  onSelectOne = selectedAsset => {
    this.setState({ selectedAssets: [selectedAsset] });
  };

  onSelectMany = selectedAssets => {
    this.setState({ selectedAssets });
  };

  render() {
    const { selectedButton, selectedAssets } = this.state;
    return (
      <View style={styles.root}>
        {selectedAssets.length === 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => this.setState({ openselector: true })}
          >
            <MaterialIcons name="add" size={24} />
          </TouchableOpacity>
        )}
        {selectedAssets.length > 0 && (
          <View style={styles.profilePic}>
            <ImageDisplay
              assets={selectedAssets}
              onUpload={selectedAssets => this.setState({ selectedAssets })}
              endpoint={this.props.endpoint}
            />
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.openselector}
          onRequestClose={() => {
            console.log('closed');
          }}
        >
          <StatusBar hidden barStyle="light-content" />

          {selectedButton === 'Library' && (
            <MediaSelector
              onCancel={this.onCancel}
              onSelectOne={this.onSelectOne}
              onSelectMany={this.onSelectMany}
              mediaType={this.props.mediaType}
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
                      selectedButton === 'Library' && { color: '#333' },
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
                      selectedButton === 'Photo' && { color: '#333' },
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
                    selectedButton === 'Video' && { color: '#333' },
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
  },
  header: {
    paddingHorizontal: 10,
    height: 45,
    borderBottomWidth: 0.5,
    borderColor: '#001529',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    color: '#001529',
  },
  albumSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 10,
    height: 45,
    borderTopWidth: 0.3,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerButton: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#CCC',
  },
  profilePic: {
    width: '100%',
    height: width,
    position: 'relative',
    backgroundColor: 'rgba(52,52,52,0)',
    borderColor: '#CCC',
    borderWidth: 0.3,
    borderRadius: 5,
    overflow: 'hidden',
  },
  uploaderContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default MediaUpload;
