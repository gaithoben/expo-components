import React, { Fragment } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Video } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '@expo/videoplayer';
import BaseScreen from './BaseScreen';
import { Spinner, Content } from 'native-base';

const { width } = Dimensions.get('window');
const COLOR = '#92DCE5';

const icon = (name, size = 36) => () => (
  <Ionicons
    name={name}
    size={size}
    color={COLOR}
    style={{ textAlign: 'center' }}
  />
);

export default class PlayerComponent extends BaseScreen {
  componentDidUpdate(prevProps) {
    if (
      prevProps.sourceUri !== '//' &&
      prevProps.sourceUri !== this.props.sourceUri
    ) {
      this._playbackInstance.pauseAsync();
      this.setState({ loading: true });
    }
  }
  onLoadStart = () => {
    // console.log('load started');
  };
  onLoad = () => {
    this.setState({ loading: false });
    this._playbackInstance.setPositionAsync(0);
    this._playbackInstance.playAsync();
  };
  render() {
    const { sourceUri, posterUri } = this.props;

    if (sourceUri !== '//') {
      return (
        <Fragment>
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: sourceUri
              },
              ref: component => {
                this._playbackInstance = component;
              },
              onLoadStart: this.onLoadStart,
              onLoad: this.onLoad
            }}
            showControlsOnLoad
            playFromPositionMillis={0}
            isPortrait={this.state.isPortrait}
            switchToLandscape={this.switchToLandscape.bind(this)}
            switchToPortrait={this.switchToPortrait.bind(this)}
            playIcon={icon('ios-play-outline')}
            pauseIcon={icon('ios-pause-outline')}
            fullscreenEnterIcon={icon('ios-expand-outline', 28)}
            fullscreenExitIcon={icon('ios-contract-outline', 28)}
          />
          {this.state.loading && (
            <View style={styles.loading}>
              <Spinner />
            </View>
          )}
        </Fragment>
      );
    }

    return (
      <View style={styles.loadingVideo}>
        <Image
          source={{ uri: posterUri }}
          style={{ width, height: 230, backgroundColor: '#555' }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingVideo: {
    height: 230
  },
  loading: {
    position: 'absolute',
    top: 0,
    height: 230,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
