import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ShieldAlert, Trash2, UserCog } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import Colors from '../../constant/Colors';
import { useAuth } from '../../context/AuthContext';
import { listUsers, updateUser, deleteUser } from '../../services/adminService';

export default function AdminUsersScreen() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ alias: '', relationship: '', interests: '', isAdmin: false });
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setErrorMessage('');
    listUsers()
      .then(setUsers)
      .catch(() => setErrorMessage('Could not load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.isAdmin) return;
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user?.isAdmin]);

  if (authLoading) {
    return (
      <SafeAreaView style={styles.page}>
        <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.deniedBox}>
          <ShieldAlert size={32} color="#dc2626" />
          <Text style={styles.deniedText}>You don't have permission to view this page.</Text>
          <TouchableOpacity onPress={() => router.replace('/home_screen/home')} style={styles.deniedButton}>
            <Text style={styles.deniedButtonText}>Go home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const openEdit = (u) => {
    setEditingUser(u);
    setEditForm({
      alias: u.alias || '',
      relationship: u.relationship || '',
      interests: u.interests || '',
      isAdmin: !!u.isAdmin,
    });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(editingUser.userUuid, editForm);
      setUsers((prev) => prev.map((u) => (u.userUuid === updated.userUuid ? updated : u)));
      setEditingUser(null);
    } catch (err) {
      setErrorMessage('Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (u) => {
    const ok = Platform.OS === 'web'
      ? window.confirm(`Delete user "${u.username}"? This cannot be undone.`)
      : true; // native confirm UX can be added later; proceeding is fine for now
    if (!ok) return;
    try {
      await deleteUser(u.userUuid);
      setUsers((prev) => prev.filter((x) => x.userUuid !== u.userUuid));
    } catch (err) {
      setErrorMessage('Could not delete that user.');
    }
  };

  const content = (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <UserCog size={28} color={Colors.PRIMARY} />
          <Text style={styles.title}>Manage Users</Text>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {loading ? (
          <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.table}>
            <View style={[styles.row, styles.headRow]}>
              <Text style={[styles.cell, styles.headCell, { flex: 1.2 }]}>Username</Text>
              <Text style={[styles.cell, styles.headCell, { flex: 1 }]}>Alias</Text>
              <Text style={[styles.cell, styles.headCell, { flex: 0.6 }]}>Admin</Text>
              <Text style={[styles.cell, styles.headCell, { flex: 1 }]}>Actions</Text>
            </View>
            {users.map((u) => (
              <View key={u.userUuid} style={styles.row}>
                <Text style={[styles.cell, { flex: 1.2 }]}>{u.username}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{u.alias || '—'}</Text>
                <Text style={[styles.cell, { flex: 0.6 }]}>{u.isAdmin ? 'Yes' : 'No'}</Text>
                <View style={[styles.cell, { flex: 1, flexDirection: 'row', gap: 10 }]}>
                  <TouchableOpacity onPress={() => openEdit(u)}>
                    <Text style={styles.linkText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(u)}>
                    <Trash2 size={16} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={!!editingUser} transparent animationType="fade" onRequestClose={() => setEditingUser(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit {editingUser?.username}</Text>

            <Text style={styles.label}>Alias</Text>
            <TextInput
              value={editForm.alias}
              onChangeText={(alias) => setEditForm({ ...editForm, alias })}
              style={styles.input}
              maxLength={40}
            />

            <Text style={styles.label}>Relationship</Text>
            <TextInput
              value={editForm.relationship}
              onChangeText={(relationship) => setEditForm({ ...editForm, relationship })}
              style={styles.input}
              maxLength={80}
            />

            <Text style={styles.label}>Interests</Text>
            <TextInput
              value={editForm.interests}
              onChangeText={(interests) => setEditForm({ ...editForm, interests })}
              style={[styles.input, { minHeight: 70, textAlignVertical: 'top' }]}
              multiline
              maxLength={240}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Admin</Text>
              <Switch
                value={editForm.isAdmin}
                onValueChange={(isAdmin) => setEditForm({ ...editForm, isAdmin })}
              />
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setEditingUser(null)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit} style={styles.saveButton} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  return Platform.OS === 'web' ? <WebLayout>{content}</WebLayout> : content;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, maxWidth: 960, width: '100%', alignSelf: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  errorText: { color: '#dc2626', marginBottom: 12 },
  table: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  row: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  headRow: { backgroundColor: '#f8fafc' },
  cell: { fontSize: 14, color: '#1e293b' },
  headCell: { fontWeight: '700', color: '#475569' },
  linkText: { color: Colors.PRIMARY, fontWeight: '700' },
  deniedBox: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, padding: 24 },
  deniedText: { fontSize: 16, color: '#334155', textAlign: 'center' },
  deniedButton: { marginTop: 8, backgroundColor: Colors.PRIMARY, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  deniedButtonText: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 420 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#0f172a', fontSize: 14 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 22 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelButtonText: { color: '#64748b', fontWeight: '700' },
  saveButton: { backgroundColor: Colors.PRIMARY, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontWeight: '700' },
});