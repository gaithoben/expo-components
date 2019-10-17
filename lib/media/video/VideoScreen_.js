import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

import * as Permissions from 'expo-permissions';

import { MaterialIcons } from '@expo/vector-icons';

export default class VideoScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();
      console.log(photo);
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={this.state.type}
          ref={ref => {
            this.camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                alignSelf: 'flex-end',
                height: 'auto',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                style={{
                  borderColor: '#FFF',
                  borderWidth: 1,
                  borderRadius: 15
                }}
                onPress={this.takePicture}
              >
                <MaterialIcons
                  name="fiber-manual-record"
                  size={72}
                  style={{
                    color: '#FFF6FF'
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  margin: 10
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <MaterialIcons
                  name="flip-to-front"
                  size={24}
                  style={{ marginBottom: 10, color: 'white' }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
}
