import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Mail } from "lucide-react-native";
import WebLayout from "../../components/WebLayout";
import Avatar from "../../components/Avatar";
import ChatPane from "../../components/messages/ChatPane";
import PeopleSearch from "../../components/messages/PeopleSearch";
import { Colors } from "../../constant/Colors";
import { getConversations } from "../../services/messages";
import { previewText, badgeText } from "../../utils/messagePreview";
import { formatListDate } from "../../utils/formatMessageTime";

// One person in the list on the left: their name, when you last talked, the start of the last message,
// and how many of their messages you haven't read.
function ConversationRow({ conversation, selected, onPress }) {
  const unread = conversation.unreadCount > 0;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, selected && styles.rowSelected]}>
      <Avatar name={conversation.displayName} size={44} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.rowTop}>
          <Text style={[styles.rowName, unread && styles.bold]} numberOfLines={1}>
            {conversation.displayName}
          </Text>
          <Text style={styles.rowDate}>{formatListDate(conversation.lastMessage.createdAt)}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={[styles.rowPreview, unread && styles.rowPreviewUnread]} numberOfLines={1}>
            {previewText(conversation)}
            {conversation.blockedByMe ? "  \u00b7 Blocked" : ""}
          </Text>
          {unread ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText(conversation.unreadCount)}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Direct messages: the people you have talked to on the left, the open conversation on the right.
// On narrow screens it shows one at a time. Open /messages?with=<userUuid> to start with someone.
export default function MessagesScreen() {
  const { width, height } = useWindowDimensions();
  const params = useLocalSearchParams();
  const wide = width >= 900;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeUuid, setActiveUuid] = useState(typeof params.with === "string" ? params.with : null);
  // Someone found with "New message" (or opened by link) who has no messages with you yet.
  const [picked, setPicked] = useState(
    typeof params.with === "string" ? { userUuid: params.with, displayName: "" } : null
  );
  const [searching, setSearching] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setConversations(await getConversations());
      setError("");
    } catch (err) {
      console.warn("Failed to load conversations", err);
      setError("Couldn't load your messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Loads now, then checks for new messages every 15 seconds.
  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => clearInterval(timer);
  }, [refresh]);

  const active =
    conversations.find((c) => c.userUuid === activeUuid) ??
    (picked && picked.userUuid === activeUuid ? picked : null);
  // Wide screens open the newest conversation until you pick another.
  const open = wide ? active ?? conversations[0] ?? null : active;
  const paneHeight = Math.max(520, height - 170);

  // A closed conversation leaves the list right away; on a wide screen the next one opens, like Discord.
  const handleClosed = (uuid) => {
    setConversations((current) => current.filter((c) => c.userUuid !== uuid));
    setActiveUuid(null);
    setPicked(null);
  };

  const select = (uuid) => {
    setActiveUuid(uuid);
    setPicked(null);
  };

  const list = (
    <View style={[styles.listPane, !wide && { flex: 1 }]}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Messages</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => setSearching(true)}>
          <Text style={styles.newButtonText}>New message</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={styles.empty}>{error}</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.userUuid}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              selected={item.userUuid === open?.userUuid}
              onPress={() => select(item.userUuid)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No messages yet. Tap New message to start a conversation.</Text>
          }
        />
      )}
    </View>
  );

  const chat = open ? (
    <ChatPane
      key={open.userUuid}
      person={open}
      onBack={wide ? undefined : () => setActiveUuid(null)}
      onChanged={refresh}
      onClosed={handleClosed}
    />
  ) : (
    <View style={styles.emptyPane}>
      <Mail size={40} color={Colors.TEXT_MUTED} />
      <Text style={styles.empty}>Pick a conversation, or start a new one.</Text>
    </View>
  );

  return (
    <WebLayout>
      <View style={styles.screen}>
        {wide ? (
          <View style={[styles.panes, { height: paneHeight }]}>
            {list}
            <View style={styles.chatPane}>{chat}</View>
          </View>
        ) : (
          <View style={[styles.single, { height: paneHeight }]}>{open ? <View style={styles.chatPane}>{chat}</View> : list}</View>
        )}
        <PeopleSearch
          visible={searching}
          onClose={() => setSearching(false)}
          onPick={(person) => {
            setSearching(false);
            setPicked(person);
            setActiveUuid(person.userUuid);
          }}
        />
      </View>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.LIGHT_GRAY, padding: 12 },
  panes: { flexDirection: "row", gap: 12 },
  single: { width: "100%" },
  listPane: {
    width: 380,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
    overflow: "hidden",
  },
  chatPane: {
    flex: 1,
    minWidth: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  listTitle: { color: Colors.TEXT, fontSize: 20, fontWeight: "800" },
  newButton: { backgroundColor: Colors.PRIMARY, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  newButtonText: { color: Colors.WHITE, fontWeight: "700", fontSize: 13 },
  empty: { color: Colors.TEXT_MUTED, padding: 16, textAlign: "center" },
  emptyPane: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.BACKGROUND_SECONDARY },
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  rowSelected: { backgroundColor: Colors.LIGHT_GRAY, borderLeftColor: Colors.BRAND_GOLD },
  rowTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  rowName: { color: Colors.TEXT, fontWeight: "600", flexShrink: 1 },
  bold: { fontWeight: "800" },
  rowDate: { color: Colors.TEXT_MUTED, fontSize: 12 },
  rowBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 2 },
  rowPreview: { color: Colors.TEXT_MUTED, fontSize: 13, flexShrink: 1 },
  rowPreviewUnread: { color: Colors.TEXT, fontWeight: "600" },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: Colors.ERROR,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: Colors.WHITE, fontSize: 11, fontWeight: "700" },
});