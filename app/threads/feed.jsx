import React from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThreadsProvider, useThreads } from './threadStore';
import { router } from 'expo-router';
import Colors from '../../constant/Colors';

function ThreadItem({ item, onLike, onOpen }) {
  return (
    <TouchableOpacity onPress={() => onOpen(item)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text style={{ fontWeight: '600', color: Colors.text }}>{item.author}</Text>
      <Text style={{ color: Colors.text, marginTop: 6 }}>{item.text}</Text>
      <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onLike(item.id)} style={{ marginRight: 12 }}>
          <Text style={{ color: Colors.primary }}>❤ {item.likes}</Text>
        </TouchableOpacity>
        <Text style={{ color: Colors.tint }}>{item.replies?.length || 0} replies</Text>
      </View>
    </TouchableOpacity>
  );
}

function FeedView() {
  const { state, actions } = useThreads();

  if (state.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={state.threads}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ThreadItem item={item} onLike={actions.likeThread} onOpen={(thread) => router.push(`/threads/detail?threadId=${thread.id}`)} />
      )}
      ListEmptyComponent={() => (
        <View style={{ padding: 16 }}>
          <Text style={{ color: Colors.text }}>No threads yet. Be the first to post!</Text>
        </View>
      )}
    />
  );
}

export default function ThreadFeed() {
  return (
    <ThreadsProvider>
      <FeedView />
    </ThreadsProvider>
  );
}