import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { formatTimestamp } from "../utils/formatTimestamp";
import { canManage } from "../utils/permissions";
import { countReplies } from "../utils/replyTree";
import FlexibleImage from "./FlexibleImage";
import ReplyImagePicker from "./ReplyImagePicker";
import { replyErrorMessage } from "../utils/replyError";

const INDENT = 16;
const MAX_INDENTED_LEVELS = 3; // deeper replies line up with level 3 so they don't squeeze to nothing

// One reply: its text and picture, a like button, Reply / Edit / Delete, and the replies to it shown
// nested below. The [-] button folds the reply (and everything under it) away, like on Reddit, so a
// long conversation doesn't fill the page. Used by the Community thread page and the event page.
//
//   reply     the reply ({ id, author, authorUuid, text, imageUri, createdAt, edited, likes, likedByMe, replies })
//   user      the signed-in user (decides who sees Edit and Delete)
//   onLike    (reply) => void
//   onReply   (reply, { text, imageUri }) => Promise -- posts a reply under `reply` (text, a picture, or both); throws if it fails
//   onEdit    (reply, text) => Promise -- changes the reply's text; throws if it fails (no Edit button without it)
//   onDelete  (reply) => void
//   inset     space left and right of a top-level reply
//   cardColor background of each reply
export default function ReplyNode({
  reply,
  depth = 0,
  user,
  onLike,
  onReply,
  onEdit,
  onDelete,
  inset = 14,
  cardColor = Colors.WHITE,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftImage, setDraftImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const hidden = countReplies(reply.replies ?? []);
  const canEdit = !!onEdit && canManage(user, reply.authorUuid);

  const send = async () => {
    const text = draft.trim();
    if ((!text && !draftImage) || sending) return;
    setSending(true);
    setError("");
    try {
      await onReply(reply, { text, imageUri: draftImage });
      setDraft("");
      setDraftImage(null);
      setReplying(false);
    } catch (err) {
      console.warn("Failed to post reply", err);
      setError(replyErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const startEdit = () => {
    setEditDraft(reply.text ?? "");
    setEditError("");
    setReplying(false);
    setEditing(true);
  };

  const saveEdit = async () => {
    const text = editDraft.trim();
    if (!text || saving) return;
    if (text === (reply.text ?? "").trim()) {
      setEditing(false); // nothing changed, so it isn't marked edited
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      await onEdit(reply, text);
      setEditing(false);
    } catch (err) {
      console.warn("Failed to edit reply", err);
      setEditError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={depth === 0 ? { marginHorizontal: inset } : null}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.header}>
          <View style={styles.who}>
            <TouchableOpacity
              onPress={() => setCollapsed((value) => !value)}
              accessibilityLabel={collapsed ? "Expand reply" : "Collapse reply"}
              style={styles.fold}
            >
              <Text style={styles.foldText}>{collapsed ? "+" : "\u2212"}</Text>
            </TouchableOpacity>
            <Text style={styles.author}>{reply.author || "Anonymous"}</Text>
          </View>
          {reply.createdAt ? (
            <Text style={styles.timestamp}>
              {formatTimestamp(reply.createdAt)}
              {reply.edited ? " \u00b7 edited" : ""}
            </Text>
          ) : null}
        </View>

        {collapsed ? (
          hidden > 0 ? (
            <Text style={styles.hidden}>
              {hidden} {hidden === 1 ? "reply" : "replies"} hidden
            </Text>
          ) : null
        ) : (
          <>
            {editing ? (
              <View style={styles.replyBox}>
                <TextInput
                  value={editDraft}
                  onChangeText={setEditDraft}
                  multiline
                  autoFocus
                  style={[styles.input, styles.editInput]}
                />
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.send, (!editDraft.trim() || saving) && { opacity: 0.5 }]}
                    onPress={saveEdit}
                    disabled={!editDraft.trim() || saving}
                  >
                    <Text style={styles.sendText}>{saving ? "Saving..." : "Save"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditing(false)}>
                    <Text style={styles.action}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                {editError ? <Text style={styles.error}>{editError}</Text> : null}
              </View>
            ) : (
              !!reply.text && <Text style={styles.text}>{reply.text}</Text>
            )}
            {reply.imageUri ? (
              <FlexibleImage uri={reply.imageUri} maxHeight={220} style={styles.image} />
            ) : null}

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onLike(reply)}>
                <Text style={[styles.like, reply.likedByMe && styles.likeOn]}>
                  {reply.likedByMe ? "\u2764" : "\u2661"} {reply.likes ?? 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setReplying((open) => !open)}>
                <Text style={styles.action}>{replying ? "Cancel" : "Reply"}</Text>
              </TouchableOpacity>
              {canEdit && !editing ? (
                <TouchableOpacity onPress={startEdit}>
                  <Text style={styles.action}>Edit</Text>
                </TouchableOpacity>
              ) : null}
              {canManage(user, reply.authorUuid) ? (
                <TouchableOpacity onPress={() => onDelete(reply)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {replying ? (
              <View style={styles.replyBox}>
                {/* A reply can be text, a picture, or both. Pasting is left to the main reply box. */}
                <ReplyImagePicker imageUri={draftImage} onChange={setDraftImage} pasteEnabled={false} />
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
                  style={[styles.send, ((!draft.trim() && !draftImage) || sending) && { opacity: 0.5 }]}
                  onPress={send}
                  disabled={(!draft.trim() && !draftImage) || sending}
                >
                  <Text style={styles.sendText}>{sending ? "Sending..." : "Send"}</Text>
                </TouchableOpacity>
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>
            ) : null}
          </>
        )}
      </View>

      {!collapsed &&
        (reply.replies ?? []).map((child) => (
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
              onEdit={onEdit}
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
    gap: 8,
  },
  who: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  fold: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  foldText: {
    color: Colors.TEXT_MUTED,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16,
  },
  author: {
    color: Colors.TEXT,
    fontWeight: "700",
    flexShrink: 1,
  },
  timestamp: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
  },
  hidden: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
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
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  input: {
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  editInput: {
    minHeight: 64,
    textAlignVertical: "top",
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