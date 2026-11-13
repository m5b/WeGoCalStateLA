import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import Avatar from "../Avatar";
import ReplyImagePicker from "../ReplyImagePicker";
import { confirmAction } from "../../utils/confirmAction";
import { formatMessageTime } from "../../utils/formatMessageTime";
import UserLink from "../UserLink";
import {
  blockUser,
  deleteMessage,
  getConversation,
  reportMessage,
  sendMessage,
  unblockUser,
} from "../../services/messages";

// The server's own wording is meant for people ("You blocked this person...", "...too fast..."), so
// it is shown as it is; anything unexpected gets a plain "try again".
function sendErrorMessage(error) {
  const friendly = [400, 403, 429].includes(error?.status) || /too large/i.test(error?.message ?? "");
  return friendly ? error.message : "Couldn't send your message. Please try again.";
}

// One conversation with one person: their name, the messages (yours on the right), and the box to write
// in. Tapping a message shows what you can do with it: report one you received, delete one you sent.
//   person     { userUuid, displayName } of who you are talking to
//   onBack     (narrow screens) go back to the list
//   onChanged  called after something changed, so the list can refresh its unread counts
export default function ChatPane({ person, onBack, onChanged }) {
  const [info, setInfo] = useState(person);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [openMessage, setOpenMessage] = useState(null);
  const [reporting, setReporting] = useState(null);
  const scrollRef = useRef(null);
  const shownCount = useRef(0);
  const changedRef = useRef(onChanged);
  changedRef.current = onChanged;

  const name = info.displayName || person.displayName;
  const blocked = Boolean(info.blockedByMe);

  const load = useCallback(async () => {
    try {
      const result = await getConversation(person.userUuid);
      setInfo(result.person);
      setMessages(result.messages);
      setError("");
      changedRef.current?.();
    } catch (err) {
      console.warn("Failed to load conversation", err);
      setError("Couldn't load this conversation.");
    } finally {
      setLoading(false);
    }
  }, [person.userUuid]);

  // Loads now, then checks for new messages every few seconds while the conversation is open.
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setInfo(person);
    shownCount.current = 0;
    load();
    const timer = setInterval(load, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person.userUuid]);

  // Keep the newest message in view.
  useEffect(() => {
    if (messages.length === shownCount.current) return;
    shownCount.current = messages.length;
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: false }));
  }, [messages.length]);

  const canSend = !sending && !blocked && (text.trim().length > 0 || !!image);

  const send = async () => {
    if (!canSend) return;
    setSending(true);
    setSendError("");
    try {
      const message = await sendMessage(person.userUuid, { text: text.trim(), imageUri: image });
      setMessages((current) => [...current, message]);
      setText("");
      setImage(null);
      changedRef.current?.();
    } catch (err) {
      console.warn("Failed to send message", err);
      setSendError(sendErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = (message) =>
    confirmAction({
      title: "Delete message",
      message: "Delete this message? It disappears for both of you.",
      onConfirm: async () => {
        try {
          await deleteMessage(message.messageUuid);
          setMessages((current) => current.filter((m) => m.messageUuid !== message.messageUuid));
          setOpenMessage(null);
          changedRef.current?.();
        } catch (err) {
          console.warn("Failed to delete message", err);
        }
      },
    });

  const toggleBlock = () =>
    confirmAction({
      title: blocked ? "Unblock" : "Block",
      message: blocked
        ? `Let ${name} send you messages again?`
        : `${name} won't be able to message you, and their messages won't count as unread. You can unblock them any time.`,
      confirmText: blocked ? "Unblock" : "Block",
      onConfirm: async () => {
        try {
          if (blocked) await unblockUser(person.userUuid);
          else await blockUser(person.userUuid);
          await load();
        } catch (err) {
          console.warn("Failed to change block", err);
        }
      },
    });

  return (
    <View style={styles.pane}>
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.back}>{"\u2190"} Back</Text>
          </TouchableOpacity>
        ) : null}
        <Avatar name={name} size={34} />
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <UserLink name={name} userUuid={person.userUuid} style={styles.name} numberOfLines={1} canMessage={false} />
        <TouchableOpacity onPress={toggleBlock}>
          <Text style={blocked ? styles.link : styles.danger}>{blocked ? "Unblock" : "Block"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
        {loading ? (
          <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 24 }} />
        ) : error ? (
          <Text style={styles.notice}>{error}</Text>
        ) : messages.length === 0 ? (
          <Text style={styles.notice}>No messages yet. Say hello to {name}!</Text>
        ) : (
          messages.map((message) => (
            <Bubble
              key={message.messageUuid}
              message={message}
              open={openMessage === message.messageUuid}
              onToggle={() => setOpenMessage((current) => (current === message.messageUuid ? null : message.messageUuid))}
              onDelete={() => confirmDelete(message)}
              onReport={() => setReporting(message)}
            />
          ))
        )}
      </ScrollView>

      {blocked ? (
        <Text style={styles.blockedNotice}>You blocked {name}. Unblock them to send a message.</Text>
      ) : (
        <View style={styles.composer}>
          {sendError ? <Text style={styles.sendError}>{sendError}</Text> : null}
          <ReplyImagePicker imageUri={image} onChange={setImage} />
          <View style={styles.inputRow}>
            <TextInput
              placeholder={`Message ${name}...`}
              placeholderTextColor={Colors.TEXT_MUTED}
              value={text}
              onChangeText={setText}
              onSubmitEditing={send}
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.sendButton, !canSend && { opacity: 0.5 }]}
              onPress={send}
              disabled={!canSend}
            >
              <Text style={styles.sendText}>{sending ? "Sending..." : "Send"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ReportDialog
        message={reporting}
        name={name}
        onClose={() => setReporting(null)}
        onReported={async (alsoBlock) => {
          if (alsoBlock) {
            await blockUser(person.userUuid);
            await load();
          }
        }}
      />
    </View>
  );
}

function Bubble({ message, open, onToggle, onDelete, onReport }) {
  const mine = message.fromMe;
  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggle}
        style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
      >
        {message.photoUrl ? (
          <Image source={{ uri: message.photoUrl }} resizeMode="cover" style={styles.photo} />
        ) : null}
        {message.content ? (
          <Text style={[styles.text, mine && styles.textMine]}>{message.content}</Text>
        ) : null}
        <Text style={[styles.time, mine && styles.timeMine]}>{formatMessageTime(message.createdAt)}</Text>
      </TouchableOpacity>
      {open ? (
        mine ? (
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.danger}>Delete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onReport}>
            <Text style={styles.danger}>Report this message</Text>
          </TouchableOpacity>
        )
      ) : null}
    </View>
  );
}

// Asks why, then sends that one message and the reason to the admins.
function ReportDialog({ message, name, onClose, onReported }) {
  const [reason, setReason] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setReason("");
    setAlsoBlock(false);
    setError("");
    setDone(false);
  }, [message?.messageUuid]);

  const submit = async () => {
    if (reason.trim().length < 3 || sending) return;
    setSending(true);
    setError("");
    try {
      await reportMessage(message.messageUuid, reason.trim());
      await onReported(alsoBlock);
      setDone(true);
    } catch (err) {
      console.warn("Failed to report message", err);
      setError(err?.status === 400 ? err.message : "Couldn't send your report. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={!!message} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          {done ? (
            <>
              <Text style={styles.dialogTitle}>Thank you</Text>
              <Text style={styles.dialogText}>
                The admins will look at this message. They only see that one message and your reason, not
                the rest of the conversation.
              </Text>
              <TouchableOpacity style={styles.sendButton} onPress={onClose}>
                <Text style={styles.sendText}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.dialogTitle}>Report this message</Text>
              <Text style={styles.dialogText}>
                This sends the message and your reason to the admins. They do not see the rest of your
                conversation with {name}.
              </Text>
              <TextInput
                placeholder="What's wrong?"
                placeholderTextColor={Colors.TEXT_MUTED}
                value={reason}
                onChangeText={setReason}
                multiline
                style={[styles.input, { minHeight: 72, textAlignVertical: "top" }]}
              />
              <View style={styles.switchRow}>
                <Switch value={alsoBlock} onValueChange={setAlsoBlock} />
                <Text style={styles.dialogText}>Also block {name}</Text>
              </View>
              {error ? <Text style={styles.sendError}>{error}</Text> : null}
              <View style={styles.dialogButtons}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.link}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, (reason.trim().length < 3 || sending) && { opacity: 0.5 }]}
                  onPress={submit}
                  disabled={reason.trim().length < 3 || sending}
                >
                  <Text style={styles.sendText}>{sending ? "Sending..." : "Send report"}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1, backgroundColor: Colors.BACKGROUND_SECONDARY },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  back: { color: Colors.PRIMARY, fontWeight: "700" },
  name: { flex: 1, color: Colors.TEXT, fontSize: 16, fontWeight: "800" },
  link: { color: Colors.PRIMARY, fontWeight: "700", fontSize: 13 },
  danger: { color: Colors.ERROR, fontWeight: "700", fontSize: 13 },
  messages: { flex: 1 },
  messagesContent: { padding: 14, gap: 8 },
  notice: { color: Colors.TEXT_MUTED, textAlign: "center", marginTop: 24 },
  row: { maxWidth: "80%", gap: 4 },
  rowMine: { alignSelf: "flex-end", alignItems: "flex-end" },
  rowTheirs: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  bubbleMine: { backgroundColor: Colors.PRIMARY },
  bubbleTheirs: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER },
  text: { color: Colors.TEXT, fontSize: 15 },
  textMine: { color: Colors.WHITE },
  photo: { width: 240, height: 180, borderRadius: 10, backgroundColor: Colors.GRAY_200 },
  time: { color: Colors.TEXT_MUTED, fontSize: 11 },
  timeMine: { color: "#e2e8f0" },
  composer: {
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  sendText: { color: Colors.WHITE, fontWeight: "700" },
  sendError: { color: Colors.ERROR, fontSize: 12 },
  blockedNotice: {
    padding: 14,
    textAlign: "center",
    color: Colors.TEXT_MUTED,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  dialog: { width: "100%", maxWidth: 440, backgroundColor: Colors.WHITE, borderRadius: 16, padding: 20, gap: 12 },
  dialogTitle: { color: Colors.TEXT, fontSize: 18, fontWeight: "800" },
  dialogText: { color: Colors.TEXT, fontSize: 14 },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dialogButtons: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 16 },
});