import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import ToolBar from './ToolBar';
import Gallery from './gallery.component';

class VideoScreen extends React.Component {
  static defaultProps = {
    onCancel: () => {},
    onSelectOne: () => {}
  };

  state = {
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.back,
    flashMode: 'off',
    captures: [],
    recordedVideo: null,
    capturing: null,
    recorded: 0
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const hasCameraPermission = camera.status === 'granted' && audio.status === 'granted';

    this.setState({ hasCameraPermission });
  }

  onDone = async () => {
    if (this.state.recordedVideo) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
        alert('Denied CAMERA permissions!');
      }

      const newasset = await MediaLibrary.createAssetAsync(
        this.state.recordedVideo.uri
      );
      this.props.onSelectOne(newasset);
      this.props.onCancel();
    } else {
      // alert('No photos to save!');
      this.props.onCancel();
    }
  };

  onDelete = () => {
    this.setState({ recordedVideo: null });
  };

  setFlashMode = flashMode => this.setState({ flashMode });

  setCameraType = cameraType => this.setState({ cameraType });

  handleCaptureIn = () => this.setState({ capturing: true });

  handleCaptureOut = () => {
    if (this.state.capturing) this.camera.stopRecording();
  };

  handleLongCapture = async () => {
    this.setState({ capturing: true, recorded: 0, recordedVideo: null });
    const interval = setInterval(() => {
      this.setState({ recorded: this.state.recorded + 1 });
    }, 1000);

    const recordedVideo = await this.camera.recordAsync({ maxDuration: 120 });
    clearInterval(interval);
    this.setState({
      capturing: false,
      recordedVideo
    });
  };

  render() {
    const {
      hasCameraPermission,
      flashMode,
      cameraType,
      capturing,
      recorded,
      recordedVideo
    } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        {!recordedVideo && (
          <Camera
            style={{ flex: 1 }}
            type={cameraType}
            flashMode={flashMode}
            ref={ref => {
              this.camera = ref;
            }}
          />
        )}
        {recordedVideo && (
          <Video
            source={{
              uri: recordedVideo.uri
            }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            isLooping
            style={{ width: 'auto', height: '100%' }}
            ref={videoRef => {
              this.videoPlayer = videoRef;
            }}
            shouldPlay
          />
        )}

        <View style={styles.header}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>

            <View />

            {recordedVideo ? (
              <TouchableOpacity onPress={this.onDone}>
                <Text style={{ ...styles.textStyle, color: '#5555FF' }}>
                  Done
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
          {recorded > 0 && (
            <View>
              <View
                style={{
                  height: 2,
                  backgroundColor: '#FFF',
                  width: `${Math.ceil((recorded * 100) / 120)}%`
                }}
              />
              <Text
                style={{
                  color: '#FFF',
                  alignSelf: 'flex-end',
                  marginRight: 5
                }}
              >
                {Number(recorded / 60).toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        <ToolBar
          recorded={recorded}
          recordedVideo={recordedVideo}
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCaptureOut={this.handleCaptureOut}
          onLongCapture={this.handleLongCapture}
          onShortCapture={this.handleShortCapture}
          onDelete={this.onDelete}
        />
      </View>
    );
  }
}

const styles = {
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  headerBar: {
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
  }
};

export default VideoScreen;
