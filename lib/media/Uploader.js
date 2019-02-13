import axios from 'axios';
import { ImageManipulator } from 'expo';

export const uploadAssetAsync = async ({
  asset,
  endpoint,
  resize,
  manipulate = true,
}) => {
  // manipulate the image through expo's image manipulator
  let manipulatedImage = {};
  if (manipulate) {
    manipulatedImage = await ImageManipulator.manipulateAsync(
      asset.localUri || asset.uri,
      [...(resize ? [{ resize: { width: 800 } }] : [])]
    );
  }

  manipulatedImage = { ...asset, ...manipulatedImage };

  const apiUrl =
    endpoint ||
    'https://file-upload-example-backend-dkhqoilqqn.now.sh/imagesupload';

  const uriParts = asset.filename.split('.');
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append('file', {
    uri: manipulatedImage.uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
    },
  };

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  // console.log('Uploading ', asset.uri, 'to :', apiUrl);
  const response = await fetch(apiUrl, options);
  const uploadResult = await response.json();

  return uploadResult;
};

export default uploadAssetAsync;
