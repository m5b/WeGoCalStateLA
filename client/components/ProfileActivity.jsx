import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Colors } from "../constant/Colors";
import { formatEventDate } from "../utils/formatEventDate";

// A person's recent posts and the events they host, as links. Under your own profile this includes your private
// ones (marked Private); under anyone else's it only has what is public.
export default function ProfileActivity({ profile }) {
  const own = Boolean(profile.isSelf);
  return (
    <>
      <View style={styles.block}>
        <Text style={styles.label}>{own ? "Your recent posts" : "Recent posts"}</Text>
        {profile.recentPosts.length ? (
          profile.recentPosts.map((post) => (
            <TouchableOpacity
              key={post.threadUuid}
              style={styles.item}
              onPress={() => router.push({ pathname: "/threads/detail", params: { threadId: post.threadUuid } })}
            >
              <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
              {post.isPublic ? null : <Text style={styles.tag}>Private</Text>}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.empty}>{own ? "You haven't posted yet." : "No public posts yet."}</Text>
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>{own ? "Events you host" : "Events they host"}</Text>
        {profile.recentEvents.length ? (
          profile.recentEvents.map((event) => (
            <TouchableOpacity
              key={event.eventUuid}
              style={styles.item}
              onPress={() => router.push({ pathname: "/home_screen/details", params: { eventId: event.eventUuid } })}
            >
              <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
              {event.isPublic ? null : <Text style={styles.tag}>Private</Text>}
              <Text style={styles.meta}>{formatEventDate(String(event.startsAt).slice(0, 10))}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.empty}>{own ? "You aren't hosting any events." : "No public events yet."}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 24 },
  label: { color: Colors.GRAY_700, fontSize: 14, fontWeight: "800", marginBottom: 8 },
  item: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.GRAY_100, flexDirection: "row", alignItems: "center", gap: 10 },
  title: { flex: 1, color: Colors.TEXT, fontSize: 14, fontWeight: "600" },
  meta: { color: Colors.TEXT_MUTED, fontSize: 12 },
  tag: { backgroundColor: Colors.BLACK, color: Colors.WHITE, fontSize: 11, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  empty: { color: Colors.TEXT_MUTED, fontSize: 14 },
});