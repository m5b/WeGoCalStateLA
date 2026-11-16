import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { replySnippet } from "../utils/replySnippet";

// Shown just above the reply bar while you are answering a particular reply, like Discord's
// "Replying to ...": who it is, the start of what they said, and an x to answer the thread instead.
export default function ReplyingToBar({ reply, onCancel }) {
  if (!reply) return null;
  return (
    <View style={styles.bar}>
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={1}>
          Replying to <Text style={styles.name}>{reply.author || "Anonymous"}</Text>
        </Text>
        {replySnippet(reply) ? (
          <Text style={styles.snippet} numberOfLines={1}>
            {replySnippet(reply)}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={onCancel} accessibilityLabel="Cancel reply" hitSlop={10}>
        <Text style={styles.close}>{"\u2715"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.BRAND_GOLD,
    borderRadius: 6,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  text: { flex: 1, minWidth: 0 },
  label: { color: Colors.TEXT_MUTED, fontSize: 12 },
  name: { color: Colors.TEXT, fontWeight: "700" },
  snippet: { color: Colors.TEXT, fontSize: 13 },
  close: { color: Colors.TEXT_MUTED, fontSize: 16, fontWeight: "700" },
});