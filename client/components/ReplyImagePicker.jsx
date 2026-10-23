import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import { Colors } from "../constant/Colors";
import { fileToDataUrl, shrinkImageUri } from "../utils/imageData";

// Lets a reply attach one image, either uploaded from the photo library or
// pasted from the clipboard (Paste button, or Ctrl/Cmd+V on web).
export default function ReplyImagePicker({ imageUri, onChange }) {
  const [error, setError] = useState("");

  async function setImage(uri) {
    if (!uri) return;
    onChange(await shrinkImageUri(uri));
    setError("");
  }

  // Web: Ctrl/Cmd+V attaches a copied image. Text pastes are left alone so
  // the reply input still works normally.
  useEffect(() => {
    if (Platform.OS !== "web") return undefined;
    const onPaste = async (e) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/")
      );
      const file = item?.getAsFile();
      if (!file) return;
      e.preventDefault();
      try {
        await setImage(await fileToDataUrl(file));
      } catch (err) {
        console.warn("Failed to read pasted image", err);
        setError("Couldn't read the pasted image.");
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
    // setImage only calls the latest onChange prop, which parents pass as a
    // stable state setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Photo library access is required.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled) await setImage(result.assets[0]?.uri);
    } catch (err) {
      console.warn(err);
      setError("Unable to open the photo picker.");
    }
  }

  async function paste() {
    try {
      if (!(await Clipboard.hasImageAsync())) {
        setError("No image found on your clipboard. Copy an image first.");
        return;
      }
      const image = await Clipboard.getImageAsync({ format: "jpeg", jpegQuality: 0.8 });
      await setImage(image?.data);
    } catch (err) {
      console.warn("Clipboard paste failed", err);
      setError(
        Platform.OS === "web"
          ? "Your browser blocked clipboard access. Try Ctrl+V (Cmd+V on Mac) instead."
          : "Couldn't paste from the clipboard."
      );
    }
  }

  return (
    <View>
      {imageUri ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <TouchableOpacity style={styles.remove} onPress={() => onChange(null)}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.row}>
        <TouchableOpacity style={styles.chip} onPress={upload}>
          <Text style={styles.chipText}>Upload image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip} onPress={paste}>
          <Text style={styles.chipText}>Paste image</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: 10,
    backgroundColor: Colors.GRAY_200,
  },
  remove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  chipText: {
    color: Colors.TEXT,
    fontSize: 13,
    fontWeight: "600",
  },
  error: {
    color: Colors.ERROR,
    fontSize: 12,
    marginBottom: 8,
  },
});
