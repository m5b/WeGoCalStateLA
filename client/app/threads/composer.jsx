import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThreads } from "./threadStore";
import { THREAD_CATEGORIES } from "../../services/threads";
import { Colors } from "../../constant/Colors";

export default function Composer() {
  const { actions } = useThreads();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  async function pickFrom(kind) {
    try {
      if (kind === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Camera access is required.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Photo library access is required.");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Unable to open picker.");
    }
  }

  async function submit() {
    if (!imageUri && !caption.trim()) {
      setError("Please add a photo or a caption.");
      return;
    }
    if (!category) {
      setError("Please choose a tag for your thread.");
      return;
    }
    setError("");

    await actions.addThread({
      caption,
      imageUri,
      category,
      createdAt: Date.now(),
    });

    setImageUri(null);
    setCaption("");
    setCategory(null);

    router.replace({ pathname: "/threads/feed", params: { category } });
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        maxWidth: 760,
        alignSelf: "center",
        width: "100%",
      }}
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: "/threads/feed",
              params: params.category ? { category: params.category } : {},
            })
          }
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Start a conversation</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.card}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: Colors.TEXT_MUTED }}>No image selected</Text>
          </View>
        )}

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.PRIMARY }]}
            onPress={() => pickFrom("library")}
          >
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.SECONDARY }]}
            onPress={() => pickFrom("camera")}
          >
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Share a question, resource, or encouraging thought…"
          placeholderTextColor={Colors.TEXT_MUTED}
          value={caption}
          onChangeText={setCaption}
          style={styles.inputMultiline}
          multiline
        />

        <Text style={styles.tagLabel}>Tag (required)</Text>
        <View style={styles.tagRow}>
          {THREAD_CATEGORIES.map((c) => {
            const selected = category === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                onPress={() => {
                  setCategory(c.key);
                  setError("");
                }}
                style={[styles.tagChip, selected && styles.tagChipSelected]}
              >
                <Text
                  style={[
                    styles.tagChipText,
                    selected && styles.tagChipTextSelected,
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.postButton} onPress={submit}>
          <Text style={styles.postButtonText}>Share with the community</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backText: {
    color: Colors.PRIMARY,
    fontWeight: "600",
  },
  title: {
    color: Colors.TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 14,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200,
  },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontWeight: "600",
  },
  inputMultiline: {
    marginTop: 12,
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    minHeight: 80,
    textAlignVertical: "top",
  },
  input: {
    marginTop: 10,
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  tagLabel: {
    marginTop: 14,
    color: Colors.TEXT,
    fontWeight: "600",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  tagChipSelected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  tagChipText: {
    color: Colors.TEXT,
    fontWeight: "600",
  },
  tagChipTextSelected: {
    color: Colors.WHITE,
  },
  errorText: {
    color: Colors.ERROR,
    marginTop: 10,
  },
  postButton: {
    marginTop: 16,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  postButtonText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
});
