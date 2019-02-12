import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Clipboard,
  Image,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class UploadingTile extends PureComponent {
  static defaultProps = {
    asset: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  _maybeRenderLocalImage = () => {
    const { asset } = this.props;

    if (!asset) {
      return null;
    }

    if (asset.uri) {
      return (
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: asset.uri }} style={styles.maybeRenderImage} />
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      );
    }
    return null;
  };

  _maybeRenderUploadedImage = () => {
    const { asset } = this.props;

    if (!asset) {
      return null;
    }

    if (asset.Location) {
      return (
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: asset.Location }}
            style={styles.maybeRenderImage}
          />
        </View>
      );
    }
    return null;
  };

  _share = () => {
    Share.share({
      message: this.props.asste.uri,
      title: 'Check out this photo',
      url: this.props.asste.uri
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.props.asste.uri);
    alert('Copied image URL to clipboard');
  };

  render() {
    console.log(this.state.asset);
    return (
      <View>
        {this._maybeRenderUploadedImage()}
        {this._maybeRenderLocalImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maybeRenderImage: {
    height: '100%',
    width: 'auto'
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.4)'
  }
});
