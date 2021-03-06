import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

export const uploadAssetAsync = async ({
  asset,
  endpoint,
  resize,
  manipulate = true,
  onProgress
}) => {
  // manipulate the image through expo's image manipulator
  let manipulatedImage = {};
  let m = [];
  if (resize) {
    m = [{ resize: { width: 800 } }];
  }

  const uriParts = asset.filename.split('.');

  if (manipulate && asset.mediaType === 'photo') {
    manipulatedImage = await ImageManipulator.manipulateAsync(
      asset.localUri || asset.uri,
      m
    );
  }

  manipulatedImage = {
    ...asset,
    ...manipulatedImage
  };

  const apiUrl = endpoint
    || 'https://file-upload-example-backend-dkhqoilqqn.now.sh/imagesupload';

  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append('file', {
    uri: manipulatedImage.uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    }
  };

  const options = {
    url: apiUrl,
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress({
        ...asset,
        percent: percentCompleted
      });
    }
  };
  // console.log('Uploading ', asset.uri, 'to :', apiUrl);
  // const response = await fetch(apiUrl, options);

  // const uploadResult = await response.json();

  // return uploadResult;

  const { data } = await axios.request(options);

  return data;
};

export default uploadAssetAsync;
