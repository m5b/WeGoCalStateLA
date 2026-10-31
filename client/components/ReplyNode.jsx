import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { formatTimestamp } from "../utils/formatTimestamp";
import { canManage } from "../utils/permissions";
import FlexibleImage from "./FlexibleImage";

const INDENT = 16;
const MAX_INDENTED_LEVELS = 3; // deeper replies line up with level 3 so they don't squeeze to nothing

// One reply: its text and picture, a like button, a Reply button that opens a small box right under
// it, and the replies to it shown nested below. Used by the Community thread page and the event page.
//
//   reply     the reply ({ id, author, authorUuid, text, imageUri, createdAt, likes, likedByMe, replies })
//   user      the signed-in user (decides who sees Delete)
//   onLike    (reply) => void
//   onReply   (reply, text) => Promise -- posts a reply under `reply`; throws if it fails
//   onDelete  (reply) => void
//   inset     space left and right of a top-level reply
//   cardColor background of each reply
export default function ReplyNode({
  reply,
  depth = 0,
  user,
  onLike,
  onReply,
  onDelete,
  inset = 14,
  cardColor = Colors.WHITE,
}) {
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    try {
      await onReply(reply, text);
      setDraft("");
      setReplying(false);
    } catch (err) {
      console.warn("Failed to post reply", err);
      setError("Couldn't post your reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={depth === 0 ? { marginHorizontal: inset } : null}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.header}>
          <Text style={styles.author}>{reply.author || "Anonymous"}</Text>
          {reply.createdAt ? (
            <Text style={styles.timestamp}>{formatTimestamp(reply.createdAt)}</Text>
          ) : null}
        </View>

        {!!reply.text && <Text style={styles.text}>{reply.text}</Text>}
        {reply.imageUri ? (
          <FlexibleImage uri={reply.imageUri} maxHeight={220} style={styles.image} />
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onLike(reply)}>
            <Text style={[styles.like, reply.likedByMe && styles.likeOn]}>
              {reply.likedByMe ? "❤" : "♡"} {reply.likes ?? 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReplying((open) => !open)}>
            <Text style={styles.action}>{replying ? "Cancel" : "Reply"}</Text>
          </TouchableOpacity>
          {canManage(user, reply.authorUuid) ? (
            <TouchableOpacity onPress={() => onDelete(reply)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {replying ? (
          <View style={styles.replyBox}>
            <TextInput
              placeholder={`Reply to ${reply.author || "Anonymous"}...`}
              placeholderTextColor={Colors.TEXT_MUTED}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
              autoFocus
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.send, (!draft.trim() || sending) && { opacity: 0.5 }]}
              onPress={send}
              disabled={!draft.trim() || sending}
            >
              <Text style={styles.sendText}>{sending ? "Sending..." : "Send"}</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        ) : null}
      </View>

      {(reply.replies ?? []).map((child) => (
        <View
          key={String(child.id)}
          style={{ marginLeft: depth < MAX_INDENTED_LEVELS ? INDENT : 0 }}
        >
          <ReplyNode
            reply={child}
            depth={depth + 1}
            user={user}
            onLike={onLike}
            onReply={onReply}
            onDelete={onDelete}
            inset={inset}
            cardColor={cardColor}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    color: Colors.TEXT,
    fontWeight: "700",
  },
  timestamp: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
  },
  text: {
    color: Colors.TEXT,
    marginTop: 4,
  },
  // A reply's picture is a small preview (at most 300px wide and 220px tall), not full width.
  image: {
    width: "100%",
    maxWidth: 300,
    alignSelf: "flex-start",
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: Colors.GRAY_200,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  like: {
    color: Colors.TEXT_MUTED,
    fontWeight: "700",
    fontSize: 13,
  },
  likeOn: {
    color: Colors.SECONDARY,
  },
  action: {
    color: Colors.PRIMARY,
    fontWeight: "600",
    fontSize: 13,
  },
  delete: {
    color: Colors.ERROR,
    fontSize: 13,
    fontWeight: "600",
  },
  replyBox: {
    marginTop: 8,
    gap: 8,
  },
  input: {
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  send: {
    alignSelf: "flex-start",
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  sendText: {
    color: Colors.WHITE,
    fontWeight: "700",
    fontSize: 13,
  },
  error: {
    color: Colors.ERROR,
    fontSize: 12,
  },
});