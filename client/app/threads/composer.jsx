import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThreads } from "./threadStore";
import { COMPOSER_CATEGORIES, TITLE_MIN, TITLE_MAX } from "../../services/threads";
import { Colors } from "../../constant/Colors";
import FlexibleImage from "../../components/FlexibleImage";
import VisibilityToggle from "../../components/VisibilityToggle";
import { GatedContent } from "../../components/SignInGate";
import { useAuth } from "../../context/AuthContext";

export default function Composer() {
  const { state, actions } = useThreads();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Opened with ?threadId=... from the thread detail screen -> edit mode.
  const editingThread = params.threadId
    ? state.threads.find((t) => String(t.id) === String(params.threadId))
    : null;
  const isEditing = !!params.threadId;

  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Prefill once the thread is available (the feed may still be loading
  // when this screen opens).
  useEffect(() => {
    if (!editingThread) return;
    setTitle(editingThread.customTitle || "");
    setCaption(editingThread.text || editingThread.caption || "");
    setCategory(editingThread.category || "general");
    setIsPublic(!!editingThread.isPublic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingThread?.id]);

  async function pickFrom(kind) {
    try {
      if (kind === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Camera access is required.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
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
          quality: 0.8,
        });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Unable to open picker.");
    }
  }

  // An event's post gets its tag (and title) from the event, so neither can be changed here.
  const isEventThread = isEditing && editingThread?.category === "events";

  async function submit() {
    const trimmedTitle = title.trim();
    if (!isEventThread && (trimmedTitle.length < TITLE_MIN || trimmedTitle.length > TITLE_MAX)) {
      setError(`Please give your thread a title (${TITLE_MIN}-${TITLE_MAX} characters).`);
      return;
    }
    // While editing, the thread's current picture counts too.
    const hasPicture = !!(imageUri || (isEditing && editingThread?.imageUri));
    if (!hasPicture && !caption.trim()) {
      setError("Please add a photo or a caption.");
      return;
    }
    if (!category) {
      setError("Please choose a tag for your thread.");
      return;
    }
    setError("");

    if (isEditing) {
      setSaving(true);
      try {
        await actions.editThread(params.threadId, {
          title: isEventThread ? editingThread?.customTitle : trimmedTitle,
          caption,
          category,
          isPublic,
           // Only a newly chosen picture is sent; leaving it alone keeps the current one.
          imageUri,
        });
        router.back();
      } catch (e) {
        console.warn("Failed to update thread", e);
        setError(imageUri ? "Couldn't save your changes or the picture. Please try again." : "Couldn't save your changes. Please try again.");
        setSaving(false);
      }
      return;
    }

    try {
      await actions.addThread({
        title: trimmedTitle,
        caption,
        imageUri,
        category,
        isPublic,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.warn("Failed to create thread", e);
      setError(e.message || "Couldn't post your thread. Please try again.");
      return;
    }

    setImageUri(null);
    setTitle("");
    setCaption("");
    setCategory(null);
    setIsPublic(false);

    router.replace({ pathname: "/threads/feed", params: { category } });
  }

  return (
    <GatedContent variant="threads" locked={!authLoading && !isAuthenticated}>
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
            isEditing
              ? router.back()
              : router.replace({
                  pathname: "/threads/feed",
                  params: params.category ? { category: params.category } : {},
                })
          }
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? "Edit thread" : "Start a conversation"}
        </Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.card}>
        {/* Tap the preview (or the empty box) to pick a photo from the library. While editing, the
            thread's current picture is shown, and picking a new one replaces it. */}
        <TouchableOpacity onPress={() => pickFrom("library")} activeOpacity={0.8}>
          {imageUri || (isEditing && editingThread?.imageUri) ? (
            <FlexibleImage uri={imageUri || editingThread.imageUri} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ color: Colors.TEXT_MUTED }}>Upload image</Text>
            </View>
          )}
        </TouchableOpacity>
        {isEditing && !imageUri && editingThread?.imageUri ? (
          <Text style={{ color: Colors.TEXT_MUTED, fontSize: 12 }}>Tap the picture, or use Gallery or Camera, to replace it.</Text>
        ) : null}

        <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.PRIMARY }]}
              onPress={() => pickFrom("library")}
            >
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
    style={[styles.button, { backgroundColor: Colors.BRAND_GOLD }]}
    onPress={() => pickFrom("camera")}
  >
    <Text style={[styles.buttonText, { color: Colors.BLACK }]}>
      Camera
    </Text>
  </TouchableOpacity>
          </View>

        {isEventThread ? null : (
          <TextInput
            placeholder="Title"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={title}
            onChangeText={setTitle}
            maxLength={TITLE_MAX}
            style={styles.input}
          />
        )}

        <TextInput
          placeholder="Share a question, resource, or encouraging thought…"
          placeholderTextColor={Colors.TEXT_MUTED}
          value={caption}
          onChangeText={setCaption}
          style={styles.inputMultiline}
          multiline
        />

        {isEventThread ? null : (
        <>
        <Text style={styles.tagLabel}>Tag (required)</Text>
        <View style={styles.tagRow}>
          {COMPOSER_CATEGORIES.map((c) => {
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
        </>
        )}

        <VisibilityToggle isPublic={isPublic} onChange={setIsPublic} noun="thread" />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.postButton, saving && { opacity: 0.5 }]}
          onPress={submit}
          disabled={saving}
        >
          <Text style={styles.postButtonText}>
            {isEditing
              ? saving
                ? "Saving..."
                : "Save changes"
              : "Share with the community"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </GatedContent>
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
