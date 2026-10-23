import { Platform } from 'react-native';

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;

// Reads a browser File/Blob (e.g. from a paste event) into a data URL.
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// On web, threads are persisted to localStorage (~5MB), so large images are
// scaled down and re-encoded as JPEG to keep saves from failing. Native URIs
// are returned unchanged.
export async function shrinkImageUri(uri) {
  if (Platform.OS !== 'web' || !uri?.startsWith('data:image')) return uri;

  try {
    const img = await new Promise((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = uri;
    });

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } catch {
    return uri;
  }
}
