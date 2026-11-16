import { Platform } from 'react-native';
import { API_BASE_URL } from '../services/api';


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

// Uploaded pictures come back from the API as "/api/uploads/...". Adding the API
// address in front makes them load even when the app is served from a different
// address than the API (like local development on :8081 vs :3000).
export function resolveUploadUrl(path) {
  if (!path) return null;
  return path.startsWith('/') ? `${API_BASE_URL}${path}` : path;
}

// Photos are shrunk to about this size before upload; the server accepts up to 8MB.
const TARGET_BYTES = 2 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

// Progressively smaller sizes/qualities to try until the photo fits.
const COMPRESS_ATTEMPTS = [
  { max: 1600, quality: 0.8 },
  { max: 1600, quality: 0.6 },
  { max: 1280, quality: 0.5 },
  { max: 1024, quality: 0.4 },
];

function loadImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const el = new window.Image();
    el.onload = () => {
      URL.revokeObjectURL(url);
      resolve(el);
    };
    el.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    el.src = url;
  });
}

// Takes a photo Blob and returns one ready to upload. Photos already under
// TARGET_BYTES come back untouched. On web, bigger ones are scaled down and
// re-encoded as JPEG (lowering size/quality step by step) until they fit; if that
// fails the original comes back. Native photos are left as the picker returned
// them (the pickers already apply JPEG compression).
export async function compressImageBlob(original) {
  if (Platform.OS !== 'web' || original.size <= TARGET_BYTES) return original;

  try {
    const img = await loadImageFromBlob(original);
    let smallest = null;
    for (const { max, quality } of COMPRESS_ATTEMPTS) {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      // JPEG has no transparency; paint white so transparent PNGs aren't black.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (!blob) continue;
      smallest = blob;
      if (blob.size <= TARGET_BYTES) break;
    }
    return smallest && smallest.size < original.size ? smallest : original;
  } catch {
    return original;
  }
}

// Reads the photo at `uri` (from the picker) as a Blob, shrinks it if it is big, and
// refuses anything the server would reject anyway.
export async function prepareImageBlob(uri) {
  const original = await (await fetch(uri)).blob();
  const blob = await compressImageBlob(original);
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error('This photo is too large to upload (limit 8 MB). Please choose a smaller one.');
  }
  return blob;
}