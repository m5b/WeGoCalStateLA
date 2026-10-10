import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useThreads } from "./threadStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constant/Colors";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { THREAD_CATEGORIES } from "../../services/threads";
import ReplyImagePicker from "../../components/ReplyImagePicker";
import { confirmAction } from "../../utils/confirmAction";

export default function ThreadDetail() {
  const { state, actions } = useThreads();
  const { threadId } = useLocalSearchParams();
  const router = useRouter();
  const [text, setText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const thread =
    state.threads.find((t) => String(t.id) === String(threadId)) ??
    state.threads[0];

  useEffect(() => {
    if (!thread || thread.repliesLoaded) return;
    setLoadingReplies(true);
    actions
      .loadThreadDetail(thread.id)
      .catch((err) => console.warn("Failed to load replies", err))
      .finally(() => setLoadingReplies(false));
      // Intentionally keyed on thread.id only: `thread` and `actions` are new
      // object references every render, so including them would refetch on
      // every state update instead of once per thread.
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread?.id]);

  if (!thread) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: Colors.TEXT }}>Thread not found.</Text>
      </View>
    );
  }

  const categoryLabel = THREAD_CATEGORIES.find(
    (c) => c.key === (thread.category ?? "general")
  )?.label;

  const performDelete = async () => {
    setDeleting(true);
    try {
      await actions.removeThread(thread.id);
      router.back();
    } catch (err) {
      console.warn("Failed to delete thread", err);
      setDeleting(false);
    }
  };

  const confirmDelete = () =>
    confirmAction({
      title: "Delete thread",
      message: "Delete this thread? This can't be undone.",
      onConfirm: performDelete,
    });

  const confirmDeleteReply = (replyId) =>
    confirmAction({
      title: "Delete reply",
      message: "Delete this reply? This can't be undone.",
      onConfirm: () =>
        actions
          .removeReply(thread.id, replyId)
          .catch((err) => console.warn("Failed to delete reply", err)),
    });

  const submit = async () => {
    if (!text.trim() && !replyImage) return;
    await actions.addReply(thread.id, { text: text.trim(), imageUri: replyImage });
    setText("");
    setReplyImage(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BACKGROUND_SECONDARY }}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Thread</Text>
        <TouchableOpacity onPress={confirmDelete} disabled={deleting}>
          <Text style={[styles.deleteText, deleting && { opacity: 0.5 }]}>
            {deleting ? "Deleting..." : "Delete"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={styles.threadCard}>
            {thread.imageUri ? (
              <Image source={{ uri: thread.imageUri }} style={styles.image} />
            ) : null}

            {categoryLabel ? (
              <Text style={styles.categoryTag}>{categoryLabel}</Text>
            ) : null}

            {!!thread.caption && (
              <Text style={styles.threadCaption}>{thread.caption}</Text>
            )}

            {!!thread.text && thread.text !== thread.caption && (
              <Text style={styles.threadBody}>{thread.text}</Text>
            )}

            {thread.createdAt ? (
              <Text style={styles.timestamp}>
                {formatTimestamp(thread.createdAt)}
              </Text>
            ) : null}

            <View style={styles.metaRow}>
              {thread.date ? (
                <Text style={styles.metaText}>{thread.date}</Text>
              ) : null}
              {thread.time ? (
                <Text style={styles.metaText}>
                  {thread.date ? " • " : ""}
                  {thread.time}
                </Text>
              ) : null}
              {thread.location ? (
                <Text style={styles.metaText}> • {thread.location}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => actions.likeThread(thread.id)}
              style={{ marginTop: 10 }}
            >
              <Text style={styles.likesText}>❤ {thread.likes ?? 0}</Text>
            </TouchableOpacity>
          </View>
        }
        data={thread.replies ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.replyCard}>
            <View style={styles.replyHeader}>
              <Text style={styles.replyAuthor}>{item.author || "Anonymous"}</Text>
              <View style={styles.replyMeta}>
                {item.createdAt ? (
                  <Text style={styles.replyTimestamp}>
                    {formatTimestamp(item.createdAt)}
                  </Text>
                ) : null}
                <TouchableOpacity onPress={() => confirmDeleteReply(item.id)}>
                  <Text style={styles.replyDelete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
            {!!item.text && <Text style={styles.replyText}>{item.text}</Text>}
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.replyImage} />
            ) : null}
          </View>
        )}
        ListFooterComponent={
          loadingReplies ? (
            <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 12 }} />
          ) : null
        }
        // Leaves room for the reply box pinned to the bottom, which grows when
        // an image preview is attached.
        contentContainerStyle={{ paddingBottom: replyImage ? 300 : 180 }}
      />
      
      <View style={styles.replyBox}>
        <ReplyImagePicker imageUri={replyImage} onChange={setReplyImage} />
        <TextInput
          placeholder="Write a reply..."
          placeholderTextColor={Colors.TEXT_MUTED}
          value={text}
          onChangeText={setText}
          style={styles.replyInput}
        />
        <TouchableOpacity style={styles.replyButton} onPress={submit}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    color: Colors.PRIMARY,
    fontWeight: "600",
  },
  deleteText: {
    color: Colors.ERROR,
    fontWeight: "600",
  },
  title: {
    color: Colors.TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  threadCard: {
    margin: 14,
    backgroundColor: Colors.GRAY_900,
    borderRadius: 16,
    padding: 14,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_800,
  },
  categoryTag: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
  },
  threadBody: {
    color: Colors.WHITE,
    fontSize: 15,
    marginTop: 6,
  },
  threadCaption: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  timestamp: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  metaText: {
    color: Colors.TEXT_MUTED,
    fontSize: 13,
  },
  likesText: {
    color: Colors.SECONDARY,
    fontWeight: "700",
  },
  replyCard: {
    marginHorizontal: 14,
    marginVertical: 6,
    padding: 12,
    backgroundColor: Colors.WHITE,       
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  replyDelete: {
    color: Colors.ERROR,
    fontSize: 12,
    fontWeight: "600",
  },
  replyTimestamp: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
  },
  replyAuthor: {
    color: Colors.TEXT,                
    fontWeight: "700",
  },
  replyText: {
    color: Colors.TEXT,                  
    marginTop: 4,
  },
  replyImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: Colors.GRAY_200,
  },
  replyBox: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 12,
  },
  replyInput: {
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    marginBottom: 10,
  },
  replyButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  replyButtonText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
});