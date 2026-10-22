// Aim for photos of at most this size; the server accepts up to 8MB.
const TARGET_BYTES = 2 * 1024 * 1024;

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

// Returns the photo at `uri` as a Blob ready to upload. Photos already under
// TARGET_BYTES are sent untouched. On web, bigger ones are scaled down and
// re-encoded as JPEG (lowering size/quality step by step) until they fit; if
// that fails the original is sent. Native photos are left as the picker
// returned them (the pickers already apply JPEG compression).
export async function prepareImageBlob(uri) {
  const original = await (await fetch(uri)).blob();
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