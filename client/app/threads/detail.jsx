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

export default function ThreadDetail() {
  const { state, actions } = useThreads();
  const { threadId } = useLocalSearchParams();
  const router = useRouter();
  const [text, setText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);

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

  const submit = async () => {
    if (!text.trim()) return;
    await actions.addReply(thread.id, text.trim());
    setText("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BACKGROUND_SECONDARY }}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Thread</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={styles.threadCard}>
            {thread.imageUri ? (
              <Image source={{ uri: thread.imageUri }} style={styles.image} />
            ) : null}

            {!!thread.caption && (
              <Text style={styles.threadCaption}>{thread.caption}</Text>
            )}

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
            <Text style={styles.replyAuthor}>{item.author || "Anonymous"}</Text>
            <Text style={styles.replyText}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          loadingReplies ? (
            <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 12 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      
      <View style={styles.replyBox}>
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
  threadCaption: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
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
  replyAuthor: {
    color: Colors.TEXT,                
    fontWeight: "700",
  },
  replyText: {
    color: Colors.TEXT,                  
    marginTop: 4,
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