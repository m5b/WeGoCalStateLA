import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ChevronDown, ShieldCheck, UserRound } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import { Colors } from '../../constant/Colors';
import { getProfile, updateProfile } from '../../services/userService';

const DEFAULT_PROFILE = {
  alias: '',
  relationship: '',
  interests: '',
};

const RELATIONSHIP_OPTIONS = [
  'Parent',
  'Guardian',
  'Sibling',
  'Spouse / Partner',
  'Friend',
  'Supporter / Mentor',
  'Other',
];

const INTEREST_OPTIONS = [
  'Campus events',
  'Family resources',
  'Mental health support',
  'Academic support',
  'Community volunteering',
  'Social activities',
  'Financial aid info',
  'Housing resources',
];

function parseInterests(value) {
  return (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [relationshipPickerOpen, setRelationshipPickerOpen] = useState(false);
  const [interestsPickerOpen, setInterestsPickerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((user) => {
        if (!isMounted) return;
        setProfile({
          alias: user.alias || '',
          relationship: user.relationship || '',
          interests: user.interests || '',
        });
      })
      .catch(() => {
        if (isMounted) setErrorMessage('Could not load your profile. Please try again.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const updated = await updateProfile(profile);
      setProfile({
        alias: updated.alias || '',
        relationship: updated.relationship || '',
        interests: updated.interests || '',
      });
      setSaved(true);
    } catch (err) {
      if (err.status === 400 && err.data) {
        setErrorMessage(Object.values(err.data).join('\n'));
      } else if (err.status === 401) {
        setErrorMessage('Please sign in again to update your profile.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const selectedInterests = parseInterests(profile.interests);

  const toggleInterest = (option) => {
    setSaved(false);
    const current = parseInterests(profile.interests);
    const next = current.includes(option)
      ? current.filter((i) => i !== option)
      : [...current, option];
    setProfile({ ...profile, interests: next.join(', ') });
  };

  const content = (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={[Colors.PRIMARY, '#111827']} style={styles.header}>
          <View style={styles.avatar}><UserRound size={32} color={Colors.PRIMARY} /></View>
          <Text style={styles.title}>Your profile</Text>
          <Text style={styles.subtitle}>Share a public alias without sharing identifying information.</Text>
        </LinearGradient>

        <View style={styles.notice}>
          <ShieldCheck size={24} color="#92400e" />
          <Text style={styles.noticeText}>
            Your profile is saved to your account and visible to the community by alias only.
          </Text>
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color={Colors.PRIMARY} style={{ marginVertical: 24 }} />
          ) : (
            <>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <Text style={styles.label}>Community alias</Text>
              <TextInput
                value={profile.alias}
                onChangeText={(alias) => { setSaved(false); setProfile({ ...profile, alias }); }}
                style={styles.input}
                maxLength={40}
                placeholder="Choose a public alias"
              />

              <Text style={styles.label}>Connection to the community</Text>
              <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setRelationshipPickerOpen(true)}>
                <Text style={profile.relationship ? styles.dropdownValue : styles.dropdownPlaceholder}>
                  {profile.relationship || 'Select one'}
                </Text>
                <ChevronDown size={18} color="#64748b" />
              </TouchableOpacity>

              <Modal visible={relationshipPickerOpen} transparent animationType="fade" onRequestClose={() => setRelationshipPickerOpen(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setRelationshipPickerOpen(false)}>
                  <View style={styles.modalCard}>
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionRow}
                        onPress={() => {
                          setSaved(false);
                          setProfile({ ...profile, relationship: option });
                          setRelationshipPickerOpen(false);
                        }}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>

              <Text style={styles.label}>What are you interested in?</Text>
              <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setInterestsPickerOpen(true)}>
                <Text
                  style={selectedInterests.length ? styles.dropdownValue : styles.dropdownPlaceholder}
                  numberOfLines={1}
                >
                  {selectedInterests.length ? selectedInterests.join(', ') : 'Select any that apply'}
                </Text>
                <ChevronDown size={18} color="#64748b" />
              </TouchableOpacity>

              <Modal visible={interestsPickerOpen} transparent animationType="fade" onRequestClose={() => setInterestsPickerOpen(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInterestsPickerOpen(false)}>
                  <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
                    {INTEREST_OPTIONS.map((option) => {
                      const checked = selectedInterests.includes(option);
                      return (
                        <TouchableOpacity
                          key={option}
                          style={styles.optionRow}
                          onPress={() => toggleInterest(option)}
                        >
                          <View style={styles.checkboxRow}>
                            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                              {checked ? <Check size={14} color="#fff" /> : null}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity style={styles.doneButton} onPress={() => setInterestsPickerOpen(false)}>
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>

              <TouchableOpacity style={styles.button} onPress={save} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{saved ? 'Saved' : 'Save profile'}</Text>
                )}
              </TouchableOpacity>
            </>
          )}
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
  errorText: { color: '#dc2626', fontSize: 14, marginBottom: 12 },
  dropdownTrigger: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownValue: { color: '#0f172a', fontSize: 15, flex: 1, marginRight: 8 },
  dropdownPlaceholder: { color: '#94a3b8', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 8, width: '100%', maxWidth: 360 },
  optionRow: { paddingVertical: 14, paddingHorizontal: 20 },
  optionText: { fontSize: 15, color: '#0f172a' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  doneButton: { marginTop: 8, marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.PRIMARY, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  doneButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});