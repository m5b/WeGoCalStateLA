import React, { useEffect, useState } from "react";
import { Image } from "react-native";

// Full-width image that keeps the photo's own aspect ratio instead of
// cropping it into a fixed-height box. Very tall photos are capped at
// maxHeight and shown whole (letterboxed) rather than cut off.
export default function FlexibleImage({ uri, style, maxHeight = 520 }) {
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (!uri) return undefined;
    let cancelled = false;
    Image.getSize(
      uri,
      (width, height) => {
        if (!cancelled && width && height) setAspectRatio(width / height);
      },
      () => {} // keep the fallback ratio if the size can't be read
    );
    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (!uri) return null;

  return (
    <Image
      source={{ uri }}
      resizeMode="contain"
      style={[
        { width: "100%", maxHeight },
        style,
        { height: undefined, aspectRatio: aspectRatio ?? 4 / 3 },
      ]}
    />
  );
}
