import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import Avatar from "./Avatar";

export function parseInterests(value) {
  return (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// "November 2026", or nothing when the date is missing.
export function formatMemberSince(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function Chip({ text, dark, soft }) {
  return (
    <View style={[styles.chip, dark && styles.chipDark, soft && styles.chipSoft]}>
      <Text style={[styles.chipText, dark && styles.chipTextDark]}>{text}</Text>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// How a person shows up to others: picture, name, role, when they joined, what they have contributed, and
// their interests. Used by the small card that opens when you click a name and by the full profile page.
//   profile        what GET /api/user/public/:userUuid returns
//   large          bigger picture and name (for the full page)
//   onMessage      shows a Message button (leave out to hide it)
//   onViewProfile  shows a View profile button (the small card uses this to open the full page)
//   onEdit         shows an Edit profile button (for your own profile)
//   children       extra sections underneath (the full page shows recent posts and events)
export default function ProfileCard({ profile, large = false, onMessage, onViewProfile, onEdit, children }) {
  const interests = parseInterests(profile.interests);
  const since = formatMemberSince(profile.memberSince);
  const stats = profile.stats || { posts: 0, replies: 0, events: 0 };

  return (
    <View>
      <View style={styles.top}>
        <Avatar name={profile.displayName} size={large ? 76 : 56} />
        <View style={styles.names}>
          <Text style={[styles.name, large && styles.nameLarge]} numberOfLines={2}>{profile.displayName}</Text>
          {profile.alias ? <Text style={styles.username}>@{profile.username}</Text> : null}
          <View style={styles.chips}>
            {profile.relationship ? <Chip text={profile.relationship} /> : null}
            {profile.isAdmin ? <Chip text="Admin" dark /> : null}
            {profile.isSelf ? <Chip text="You" dark /> : null}
          </View>
        </View>
      </View>

      {since ? <Text style={styles.since}>Member since {since}</Text> : null}

      <View style={styles.stats}>
        <Stat label="Posts" value={stats.posts} />
        <Stat label="Replies" value={stats.replies} />
        <Stat label="Events" value={stats.events} />
      </View>

      {interests.length ? (
        <View style={styles.block}>
          <Text style={styles.sectionLabel}>Interests</Text>
          <View style={styles.chips}>
            {interests.map((interest) => (
              <Chip key={interest} text={interest} soft />
            ))}
          </View>
        </View>
      ) : null}

      {onMessage || onViewProfile || onEdit ? (
        <View style={styles.actions}>
          {onMessage ? (
            <TouchableOpacity style={styles.primaryButton} onPress={onMessage}>
              <Text style={styles.primaryText}>Message</Text>
            </TouchableOpacity>
          ) : null}
          {onViewProfile ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={onViewProfile}>
              <Text style={styles.secondaryText}>View profile</Text>
            </TouchableOpacity>
          ) : null}
          {onEdit ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={onEdit}>
              <Text style={styles.secondaryText}>Edit profile</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 14 },
  names: { flex: 1 },
  name: { color: Colors.TEXT, fontSize: 19, fontWeight: "800" },
  nameLarge: { fontSize: 24 },
  username: { color: Colors.TEXT_MUTED, fontSize: 13, marginTop: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: { backgroundColor: Colors.GRAY_100, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  chipDark: { backgroundColor: Colors.BLACK },
  chipSoft: { backgroundColor: "#fff3bf" },
  chipText: { color: Colors.GRAY_700, fontSize: 12, fontWeight: "700" },
  chipTextDark: { color: Colors.WHITE },
  since: { color: Colors.TEXT_MUTED, fontSize: 13, marginTop: 14 },
  stats: { flexDirection: "row", gap: 10, marginTop: 14 },
  stat: { flex: 1, backgroundColor: Colors.GRAY_50, borderColor: Colors.GRAY_200, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  statValue: { color: Colors.TEXT, fontSize: 18, fontWeight: "800" },
  statLabel: { color: Colors.TEXT_MUTED, fontSize: 12, marginTop: 2 },
  block: { marginTop: 16 },
  sectionLabel: { color: Colors.GRAY_700, fontSize: 13, fontWeight: "800" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  primaryButton: { backgroundColor: Colors.PRIMARY, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11 },
  primaryText: { color: Colors.WHITE, fontWeight: "800", fontSize: 14 },
  secondaryButton: { borderColor: Colors.GRAY_300, borderWidth: 1, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11 },
  secondaryText: { color: Colors.TEXT, fontWeight: "700", fontSize: 14 },
});