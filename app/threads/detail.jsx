import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { ThreadsProvider, useThreads } from './threadStore';
import { useLocalSearchParams } from 'expo-router';
import Colors from '../../constant/Colors';

function ReplyItem({ item }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <Text style={{ fontWeight: '600', color: Colors.text }}>{item.author}</Text>
      <Text style={{ color: Colors.text, marginTop: 4 }}>{item.text}</Text>
    </View>
  );
}

function DetailInner() {
  const { state, actions } = useThreads();
  const [text, setText] = useState('');
  const { threadId } = useLocalSearchParams();
  const thread = state.threads.find((t) => t.id === threadId) || state.threads[0];

  if (!thread) {
    return (
      <View style={{ padding: 16 }}>
        <Text>No thread found.</Text>
      </View>
    );
  }

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await actions.addReply(thread.id, trimmed);
    setText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>{thread.author}</Text>
        <Text style={{ marginTop: 8 }}>{thread.text}</Text>
        <TouchableOpacity onPress={() => actions.likeThread(thread.id)} style={{ marginTop: 8 }}>
          <Text style={{ color: Colors.primary }}>❤ {thread.likes}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={thread.replies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReplyItem item={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => <Text style={{ padding: 16 }}>No replies yet.</Text>}
      />

      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }}>
        <TextInput
          placeholder="Write a reply..."
          value={text}
          onChangeText={setText}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />
        <Button title="Reply" onPress={submit} />
      </View>
    </View>
  );
}

export default function ThreadDetail() {
  return (
    <ThreadsProvider>
      <DetailInner />
    </ThreadsProvider>
  );
}