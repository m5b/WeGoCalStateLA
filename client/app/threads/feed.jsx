import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThreads } from "./threadStore";
import { THREAD_CATEGORIES } from "../../services/threads";
import { Colors } from "../../constant/Colors";
import { formatTimestamp } from "../../utils/formatTimestamp";

function ThreadItem({ item, onPress, onLike }) {
  const title =
    item.caption ||
    item.text ||
    (item.imageUri ? "New event shared" : "New thread");

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {item.imageUri ? (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {item.createdAt ? (
        <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
      ) : null}

      <View style={styles.metaRow}>
        {item.date ? (
          <Text style={styles.metaText}>{item.date}</Text>
        ) : null}
        {item.time ? (
          <Text style={styles.metaText}>
            {item.date ? " • " : ""}
            {item.time}
          </Text>
        ) : null}
        {item.location ? (
          <Text style={styles.metaText}> • {item.location}</Text>
        ) : null}
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity
          onPress={onLike}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={styles.likesText}>❤ {item.likes ?? 0}</Text>
        </TouchableOpacity>
        <Text style={styles.metaText}>
          {(item.replies?.length ?? 0)} replies
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ThreadFeed() {
  const { state, actions } = useThreads();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [category, setCategory] = useState(
    THREAD_CATEGORIES.some((c) => c.key === params.category)
      ? params.category
      : "general"
  );

  const visibleThreads = state.threads
    .filter((t) => (t.category ?? "general") === category)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

  if (state.loading && !state.threads.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BACKGROUND_SECONDARY }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.screenTitle}>Community conversations</Text>
          <Text style={styles.previewText}>Preview data is stored only in this browser. Do not share private information.</Text>
        </View>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() =>
            router.push({ pathname: "/threads/composer", params: { category } })
          }
        >
          <Text style={styles.newButtonText}>+ Start a conversation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {THREAD_CATEGORIES.map((c) => {
          const selected = category === c.key;
          const count = state.threads.filter(
            (t) => (t.category ?? "general") === c.key
          ).length;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => setCategory(c.key)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                {c.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={visibleThreads}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ThreadItem
            item={item}
            onPress={() =>
              router.push({
                pathname: "/threads/detail",
                params: { threadId: item.id },
              })
            }
            onLike={() => actions.likeThread(item.id)}
          />
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={() => (
          <View style={{ padding: 16 }}>
            <Text style={{ color: Colors.TEXT_MUTED }}>
              No threads in this category yet. Be the first to post!
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.TEXT,
  },
  previewText: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  newButtonText: {
    color: Colors.WHITE,
    fontWeight: "600",
    fontSize: 14,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  tabSelected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  tabText: {
    color: Colors.TEXT,
    fontWeight: "600",
  },
  tabTextSelected: {
    color: Colors.WHITE,
  },
  card: {
    backgroundColor: Colors.GRAY_900,
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_800,
    marginBottom: 10,
  },
  title: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "700",
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
  footerRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesText: {
    color: Colors.SECONDARY,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
