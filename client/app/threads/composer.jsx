import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { ThreadsProvider, useThreads } from './threadStore';

function ComposerInner() {
  const { actions } = useThreads();
  const [text, setText] = useState('');

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await actions.addThread(trimmed);
    setText('');
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Share something..."
        value={text}
        onChangeText={setText}
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />
      <Button title="Post" onPress={submit} />
    </View>
  );
}

export default function ThreadComposer() {
  return (
    <ThreadsProvider>
      <ComposerInner />
    </ThreadsProvider>
  );
}