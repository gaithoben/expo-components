import axios from 'axios';

export const uploadAssetAsync = async ({ asset, endpoint }) => {
  const apiUrl = endpoint
    || 'https://file-upload-example-backend-dkhqoilqqn.now.sh/imagesupload';

  const uriParts = asset.filename.split('.');
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
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
    }
  };

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  };
  // console.log('Uploading ', asset.uri, 'to :', apiUrl);
  const response = await fetch(apiUrl, options);
  const uploadResult = await response.json();

  return uploadResult;
};

export default uploadAssetAsync;
