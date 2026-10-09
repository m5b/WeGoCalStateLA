import { Platform } from 'react-native';
import { apiForm } from './api';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const imageExtensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function imageType(imageUri, asset) {
  const suppliedType = asset.file?.type || asset.mimeType;
  if (suppliedType) return suppliedType.toLowerCase();
  const dataType = imageUri.match(/^data:([^;,]+)/i)?.[1];
  if (dataType) return dataType.toLowerCase();
  const extension = imageUri.split(/[?#]/)[0].split('.').pop().toLowerCase();
  return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[extension];
}

function checkImage(type, size) {
  if (!imageExtensions[type]) throw new Error('Use a JPEG, PNG, or WebP flyer image.');
  if (size > MAX_IMAGE_BYTES) throw new Error('The flyer must be 5 MB or smaller.');
  if (size === 0) throw new Error('The selected image is empty. Please choose another image.');
}

export async function extractEventFromFlyer(imageUri, asset = {}) {
  if (!imageUri) throw new Error('Select a flyer image first.');
  const body = new FormData();
  let type = imageType(imageUri, asset);

  if (Platform.OS === 'web') {
    let image = asset.file;
    if (!image) {
      const response = await fetch(imageUri);
      if (!response.ok) throw new Error('Unable to read the selected image. Please choose it again.');
      image = await response.blob();
    }
    type = image.type || type;
    checkImage(type, image.size);
    body.append('image', image, asset.fileName || 'flyer.' + imageExtensions[type]);
  } else {
    checkImage(type, asset.fileSize);
    body.append('image', { uri: imageUri, type, name: 'flyer.' + imageExtensions[type] });
  }

  // Fetch supplies the multipart boundary; the existing API helper sends session cookies.
  let response;
  try {
    response = await apiForm('/api/ai/extract-event', body);
  } catch (error) {
    if (error.status) throw error;
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }
  const result = response?.data;
  if (response?.status !== 'success'
    || !['likely_event', 'uncertain', 'not_event'].includes(result?.eventStatus)
    || ['eventStatusReason', 'title', 'description', 'date', 'time', 'location'].some((key) => typeof result[key] !== 'string')) {
    throw new Error('The flyer response was incomplete. Please try again.');
  }
  return result;
}
