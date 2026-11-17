import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constant/Colors";
import { formatTimestamp } from "../utils/formatTimestamp";
import UserLink from "./UserLink";

// Shared by the feed and opened conversation. Locked posts show only their date.
export default function ThreadByline({ thread }) {
  const name = thread.author?.trim() || "Anonymous";
  const timestamp = formatTimestamp(thread.createdAt);
  const profileUuid = ["Anonymous", "[Deleted]"].includes(name) ? null : thread.authorUuid;

  return (
    <View style={styles.row}>
      {!thread.locked && (
        <View style={styles.person}>
          <Text style={styles.timestamp}>By </Text>
          <UserLink name={name} userUuid={profileUuid} style={styles.name} numberOfLines={1} />
        </View>
      )}
      {!!timestamp && <Text style={styles.timestamp}>{thread.locked ? "" : "\u00b7 "}{timestamp}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: 6, rowGap: 2 },
  person: { flexDirection: "row", alignItems: "center", maxWidth: "100%", flexShrink: 1 },
  name: { color: Colors.GRAY_100, fontSize: 13, lineHeight: 18, fontWeight: "600", flexShrink: 1 },
  timestamp: { color: Colors.GRAY_400, fontSize: 12, lineHeight: 18, flexShrink: 1 },
});
