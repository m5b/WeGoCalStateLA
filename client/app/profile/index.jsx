import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, UserRound } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import { Colors } from '../../constant/Colors';

const PROFILE_KEY = 'wego-preview-profile-v1';
const DEFAULT_PROFILE = {
  alias: 'Community guest',
  relationship: 'Family member or supporter',
  interests: 'Campus events, family resources, and community connection',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = globalThis.localStorage?.getItem(PROFILE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch {
      // Keep the preview defaults when browser storage is unavailable.
    }
  }, []);

  const save = () => {
    try {
      globalThis.localStorage?.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // The preview still works without persistence.
    }
    setSaved(true);
  };

  const content = (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={[Colors.PRIMARY, '#111827']} style={styles.header}>
          <View style={styles.avatar}><UserRound size={32} color={Colors.PRIMARY} /></View>
          <Text style={styles.title}>Your preview profile</Text>
          <Text style={styles.subtitle}>Explore a public alias without sharing identifying information.</Text>
        </LinearGradient>

        <View style={styles.notice}>
          <ShieldCheck size={24} color="#92400e" />
          <Text style={styles.noticeText}>
            This evaluation profile stays in this browser. Authentication and student-sponsored account approval are not enabled yet.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Community alias</Text>
          <TextInput
            value={profile.alias}
            onChangeText={(alias) => { setSaved(false); setProfile({ ...profile, alias }); }}
            style={styles.input}
            maxLength={40}
            placeholder="Choose a public alias"
          />

          <Text style={styles.label}>Connection to the community</Text>
          <TextInput
            value={profile.relationship}
            onChangeText={(relationship) => { setSaved(false); setProfile({ ...profile, relationship }); }}
            style={styles.input}
            maxLength={80}
            placeholder="Parent, sibling, loved one, supporter…"
          />

          <Text style={styles.label}>What are you interested in?</Text>
          <TextInput
            value={profile.interests}
            onChangeText={(interests) => { setSaved(false); setProfile({ ...profile, interests }); }}
            style={[styles.input, styles.multiline]}
            multiline
            maxLength={240}
            placeholder="Resources, events, questions, or topics"
          />

          <TouchableOpacity style={styles.button} onPress={save}>
            <Text style={styles.buttonText}>{saved ? 'Saved on this device' : 'Save preview profile'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return Platform.OS === 'web' ? <WebLayout>{content}</WebLayout> : content;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 48 },
  header: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 46 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 30, fontWeight: '850', textAlign: 'center' },
  subtitle: { color: '#dbeafe', fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 560, marginTop: 8 },
  notice: { flexDirection: 'row', gap: 14, width: '100%', maxWidth: 720, alignSelf: 'center', marginTop: 28, padding: 18, backgroundColor: '#fffbeb', borderColor: '#fde68a', borderWidth: 1, borderRadius: 12 },
  noticeText: { flex: 1, color: '#92400e', fontSize: 14, lineHeight: 21 },
  card: { width: '100%', maxWidth: 720, alignSelf: 'center', marginTop: 20, padding: 24, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { color: '#334155', fontSize: 14, fontWeight: '700', marginTop: 14, marginBottom: 7 },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: '#0f172a', fontSize: 15 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  button: { marginTop: 24, borderRadius: 10, backgroundColor: Colors.PRIMARY, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
