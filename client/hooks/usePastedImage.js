import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxImageBytes = 5 * 1024 * 1024;

// Paste selects an image only. The existing Autofill button owns extraction.
export default function usePastedImage({ disabled, onImage, onError }) {
  const options = useRef({ disabled, onImage, onError });
  options.current = { disabled, onImage, onError };
  const cancelRead = useRef(() => {});

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    let reader = null;
    function cancel() {
      const previous = reader;
      reader = null;
      if (previous?.readyState === 1) previous.abort();
    }
    cancelRead.current = cancel;

    function handlePaste(event) {
      if (options.current.disabled) return;
      const images = Array.from(event.clipboardData?.items || [])
        .filter((item) => item.type.startsWith('image/'));
      // Let ordinary text paste reach Title, Description, and other fields normally.
      if (!images.length) return;
      cancel();
      const item = images.find((image) => supportedTypes.has(image.type));
      if (!item) {
        options.current.onError('Cannot paste this image type. Use a JPEG, PNG, or WebP image.');
        return;
      }
      const file = item.getAsFile();
      if (!file || !supportedTypes.has(file.type)) {
        options.current.onError('Unable to read the copied image. Try copying it again.');
        return;
      }
      if (!file.size || file.size > maxImageBytes) {
        options.current.onError('Paste a non-empty image that is 5 MB or smaller.');
        return;
      }
      event.preventDefault();
      const nextReader = new FileReader();
      reader = nextReader;
      nextReader.onload = () => {
        if (reader !== nextReader) return;
        reader = null;
        if (options.current.disabled) return;
        options.current.onImage({
          uri: nextReader.result, file, fileName: file.name,
          mimeType: file.type, fileSize: file.size,
        });
      };
      nextReader.onerror = () => {
        if (reader !== nextReader) return;
        reader = null;
        if (!options.current.disabled) options.current.onError('Unable to read the copied image. Try copying it again.');
      };
      // A data URL preserves the original bytes and remains usable after navigation.
      nextReader.readAsDataURL(file);
    }

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
      cancel();
      cancelRead.current = () => {};
    };
  }, []);

  return () => cancelRead.current();
}
