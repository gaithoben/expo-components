import React, { PureComponent, Fragment } from 'react';
import { MediaLibrary, Video } from 'expo';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import contains from 'ramda/src/contains';
import AlbumSelector from './AlbumSelector';
import ImageTile from './ImageTile';
import { getAlbums } from './getAlbums';

const { width } = Dimensions.get('window');

class MediaSelector extends PureComponent {
  static defaultProps = {
    onCancel: () => {},
    onSelectMany: () => {},
    onSelectOne: () => {},
    mediaType: ['photo', 'video'],
    limit: 40
  };

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      albums: [],
      selectmultiple: false,
      openalbumselect: false,
      media: [],
      after: null,
      hasNextPage: true,
      selectedAlbum: null,
      selectedAsset: {},
      selectedVideo: {},
      selectedAssets: [],
      downloadingmedia: false
    };
  }

  componentDidMount() {
    this.getPermissions();
    this.getAlbums();
  }

  getPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  getAlbums = async () => {
    const { selectedAlbum, albums } = this.state;
    if (albums.length === 0) {
      const newalbums = await getAlbums();
      if (!selectedAlbum && newalbums.length > 0) {
        this.setState(
          { selectedAlbum: newalbums[0], albums: newalbums },
          () => {
            this.getPhotos();
          }
        );
      }
    }
  };

  getPhotos = async () => {
    const { selectedAlbum } = this.state;
    if (selectedAlbum) {
      const params = {
        first: 20,
        mediaType: this.props.mediaType
      };

      if (selectedAlbum.id !== 'all' && selectedAlbum.id !== 'videos') params.album = selectedAlbum.id;
      if (
        selectedAlbum.id === 'videos'
        && contains('video', this.props.mediaType)
      ) params.mediaType = ['video'];

      if (this.state.after) params.after = this.state.after;
      if (!this.state.hasNextPage) return;
      MediaLibrary.getAssetsAsync(params).then(this.processPhotos);
    }
  };

  processPhotos = r => {
    if (this.state.after === r.endCursor) return;
    const uris = r.assets.map(i => ({
      id: i.id,
      filename: i.filename,
      uri: i.uri,
      mediaType: i.mediaType,
      width: i.width,
      height: i.height,
      duration: i.duration
    }));

    this.setState(state => ({
      media: [...state.media, ...uris],
      after: r.endCursor,
      hasNextPage: r.hasNextPage,
      selectedAsset: { ...uris[0] }
    }));
  };

  renderImageTile = ({ item, index }) => {
    let ind = -1;
    let itemtodisplay = item;
    if (this.state.selectmultiple) {
      ind = this.state.selectedAssets.findIndex(i => i.id === item.id);
      if (ind !== -1) {
        itemtodisplay = this.state.selectedAssets[ind];
      }
    }
    const selected = item.id === this.state.selectedAsset.id || ind !== -1;

    return (
      <ImageTile
        item={itemtodisplay}
        index={index}
        camera={false}
        selected={selected}
        showCount={this.state.selectmultiple && selected}
        onSelectImage={this.onSelectImage}
      />
    );
  };

  onSelectAlbum = selectedAlbum => {
    const currentalbumname = this.state.selectedAlbum.title;
    if (currentalbumname !== selectedAlbum.title) {
      this.setState(
        {
          selectedAlbum,
          openalbumselect: false,
          media: [],
          after: null,
          hasNextPage: true
        },
        () => {
          this.getPhotos();
        }
      );
    } else {
      this.setState({ openalbumselect: false });
    }
  };

  onCancel = () => {
    this.props.onCancel();
    this.setState({ openalbumselect: false });
  };

  onSelectImage = selectedAsset => {
    // this.videoPlayer.stopAsync();
    // this.videoPlayer.unloadAsync();
    this.setState({ downloadingmedia: true, selectedAsset }, async () => {
      let newasset = await MediaLibrary.getAssetInfoAsync(selectedAsset.id);

      if (newasset.id === this.state.selectedAsset.id) {
        this.setState(state => {
          if (state.selectmultiple) {
            if (this.state.selectedAssets.count === this.props.limit) {
              return {
                downloadingmedia: false
              };
            }

            const ind = state.selectedAssets.findIndex(
              i => i.id === selectedAsset.id
            );
            let selectedasset = { ...selectedAsset };
            let selectedassets = [...state.selectedAssets];

            if (ind !== -1) {
              selectedassets = state.selectedAssets
                .filter(i => i.id !== selectedAsset.id)
                .map((a, index) => ({ ...a, selectCount: index + 1 }));

              if (selectedassets.length > 0) {
                selectedasset = { ...selectedassets[0] };
                newasset = selectedasset;
              }
            } else {
              selectedassets = [...selectedassets, selectedAsset].map(
                (a, index) => ({ ...a, selectCount: index + 1 })
              );
            }

            return {
              downloadingmedia: false,
              selectedVideo: newasset,
              selectedAsset: selectedasset,
              selectedAssets: [...selectedassets]
            };
          }
          //   const assetdetails = await MediaLibrary.getAssetInfoAsync(
          //     selectedAsset.id
          //   );
          //   console.log('ASSET: ', assetdetails);

          return {
            downloadingmedia: false,
            selectedVideo: newasset,
            selectedAsset: newasset
          };
        });
      }
    });
  };

  onSelectMultiple = () => {
    const { selectmultiple, selectedAsset } = this.state;
    this.setState({
      selectmultiple: !selectmultiple,
      selectedAssets: [selectedAsset].map((a, index) => ({
        ...a,
        selectCount: 1
      }))
    });
  };

  onNext = () => {
    const { selectmultiple, selectedAsset, selectedAssets } = this.state;

    if (selectmultiple) {
      this.props.onSelectMany(selectedAssets);
    } else {
      this.props.onSelectOne(selectedAsset);
    }

    this.props.onCancel();
  };

  render() {
    const {
      selectedAsset,
      openalbumselect,
      selectmultiple,
      downloadingmedia,
      selectedVideo
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.onCancel}>
            <Text style={styles.textStyle}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.albumSelect}
            onPress={() => this.setState({ openalbumselect: !openalbumselect })}
          >
            <Text
              style={{
                ...styles.textStyle,
                color: '#333',
                fontWeight: 'bold'
              }}
            >
              {this.state.selectedAlbum
                ? this.state.selectedAlbum.title
                : 'All Photos'}
            </Text>
            {openalbumselect ? (
              <Animatable.View animation="flipInY">
                <MaterialIcons name="keyboard-arrow-up" size={24} />
              </Animatable.View>
            ) : (
              <Animatable.View animation="flipInY">
                <MaterialIcons name="keyboard-arrow-down" size={24} />
              </Animatable.View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onNext}>
            <Text style={{ ...styles.textStyle, color: '#5555FF' }}>Next</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 0, position: 'relative', flex: 1 }}>
          <View
            style={{ height: width, marginBottom: 2, position: 'relative' }}
          >
            <Fragment>
              <Image
                source={{
                  uri: selectedAsset.uri || './assets/no_available_image.png'
                }}
                style={{ width: 'auto', height: width }}
              />
              {downloadingmedia && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
            </Fragment>

            {selectedAsset.mediaType === 'video' && !downloadingmedia && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              >
                <Video
                  source={{
                    uri: selectedVideo.uri
                  }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  isLooping
                  style={{ width: 'auto', height: width }}
                  ref={videoRef => {
                    this.videoPlayer = videoRef;
                  }}
                  shouldPlay
                />
              </View>
            )}

            <View style={styles.optionsView}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectmultiple && { backgroundColor: '#3b5998' }
                ]}
                onPress={this.onSelectMultiple}
                disabled={this.props.limit === 1}
              >
                <AntDesign name="switcher" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={this.state.media}
            numColumns={4}
            renderItem={this.renderImageTile}
            keyExtractor={(item, index) => item.id+index}
            onEndReached={() => {
              this.getPhotos();
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<Text>Loading...</Text>}
            initialNumToRender={24}
            getItemLayout={this.getItemLayout}
          />

          {openalbumselect && (
            <AlbumSelector
              albums={this.state.albums}
              selectedAlbum={this.state.selectedAlbum}
              onSelect={this.onSelectAlbum}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  optionsView: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    left: 0,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  optionButton: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  counter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#001529'
  }
});

export default MediaSelector;
