import React from 'react';
import { Platform } from 'react-native';
import { FileSystem, Permissions, MediaLibrary } from 'expo';
import countBy from 'ramda/src/countBy';
import keys from 'ramda/src/keys';
import last from 'ramda/src/last';
import sortWith from 'ramda/src/sortWith';
import descend from 'ramda/src/descend';
import prop from 'ramda/src/prop';

const getAllPhotos = () => new Promise(async resolve => {
  const photos = await MediaLibrary.getAssetsAsync({ first: 20000 });
  const image = photos.assets[0] || {};
  resolve({
    id: 'all',
    title: 'All Photos',
    assetCount: photos.totalCount,
    media: {
      id: image.id,
      filename: image.filename,
      uri: image.uri,
      mediaType: image.mediaType,
      width: image.width,
      height: image.height,
      duration: image.duration
    }
  });
});

const getAllVideos = () => new Promise(async resolve => {
  const videos = await MediaLibrary.getAssetsAsync({
    first: 20000,
    mediaType: ['video']
  });
  const image = videos.assets[0] || {};
  resolve({
    id: 'videos',
    title: 'Videos',
    assetCount: videos.totalCount,
    media: {
      id: image.id,
      filename: image.filename,
      uri: image.uri,
      mediaType: image.mediaType,
      width: image.width,
      height: image.height,
      duration: image.duration
    }
  });
});

const getFirstMedia = album => new Promise(async resolve => {
  const photos = await MediaLibrary.getAssetsAsync({ first: 1, album });
  if (photos.assets) {
    const image = photos.assets[0] || {};
    resolve({
      id: image.id,
      filename: image.filename,
      uri: image.uri,
      mediaType: image.mediaType,
      width: image.width,
      height: image.height,
      duration: image.duration
    });
  }
  return resolve(null);
});

export const getAlbums = async () => new Promise(async (resolve, reject) => {
  //   CameraRoll.getPhotos(options).then(result => {
  //     const groupNames = result.edges.map(item => item.node.group_name);
  //     const groups = countBy(i => i)(groupNames);
  //     const countSort = sortWith([descend(prop('count'))]);

  //     const albumnames = keys(groups);

  //     const albums = albumnames.map(name => {
  //       const lastitem = last(
  //         result.edges.filter(i => i.node.group_name === name)
  //       );
  //       return {
  //         name,
  //         count: groups[name],
  //         media: lastitem.node || {}
  //       };
  //     });

  //     resolv(countSort(albums));
  //   });

  const result = await MediaLibrary.getAlbumsAsync();

  const albums = result.map(async album => ({
    id: album.id,
    title: album.title,
    assetCount: album.assetCount,
    media: await getFirstMedia(album.id)
  }));

  const allphotos = await getAllPhotos();
  const allvideos = await getAllVideos();

  Promise.all(albums).then(results => {
    resolve([allphotos, ...results, allvideos]);
  });
});

export const getAssetDetails = async asset => {
  const assetdetails = await MediaLibrary.getAssetInfoAsync(asset.id);
  console.log('Asset details: ', assetdetails);
  return assetdetails;
};
