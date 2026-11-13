import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { ShieldAlert, Trash2, UserCog } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';
import { Colors } from '../../constant/Colors';
import { useAuth } from '../../context/AuthContext';
import { confirmAction } from '../../utils/confirmAction';
import { listUsers, updateUser, deleteUser, getAdminStats } from '../../services/adminService';

const PAGE_SIZE = 15;
const ROLE_FILTERS = [
  { key: '', label: 'Everyone' },
  { key: 'admin', label: 'Admins' },
  { key: 'member', label: 'Members' },
];

function formatJoined(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatCard({ label, value, onPress, highlight }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[styles.statCard, highlight && styles.statCardHighlight]} onPress={onPress}>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value ?? '–'}</Text>
      <Text style={[styles.statLabel, highlight && styles.statValueHighlight]}>{label}</Text>
    </Wrapper>
  );
}

export default function AdminUsersScreen() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ alias: '', relationship: '', interests: '', isAdmin: false });
  const [saving, setSaving] = useState(false);
  const latestRequest = useRef(0);
  const isAdmin = Boolean(user?.isAdmin);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // The search runs a moment after you stop typing, and starts again from the first page.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadUsers = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await listUsers({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, search, role });
      if (requestId !== latestRequest.current) return; // a newer search has already replaced this one
      setUsers(result.users);
      setTotal(result.total);
    } catch {
      if (requestId === latestRequest.current) setErrorMessage('Could not load users.');
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [page, search, role]);

  const loadStats = useCallback(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !isAdmin) return;
    loadUsers();
  }, [authLoading, isAuthenticated, isAdmin, loadUsers]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !isAdmin) return;
    loadStats();
  }, [authLoading, isAuthenticated, isAdmin, loadStats]);

  // After deleting the last person on a page, step back to the page before it.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (authLoading) {
    return (
      <SafeAreaView style={styles.page}>
        <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.deniedBox}>
          <ShieldAlert size={32} color="#dc2626" />
          <Text style={styles.deniedText}>You don&apos;t have permission to view this page.</Text>
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
      loadStats();
    } catch (err) {
      setErrorMessage(err?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (u) =>
    confirmAction({
      title: 'Delete user',
      message: `Delete "${u.username}"? This cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteUser(u.userUuid);
          loadUsers();
          loadStats();
        } catch {
          setErrorMessage('Could not delete that user.');
        }
      },
    });

  const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, total);
  const editingSelf = editingUser?.userUuid === user?.userUuid;

  const content = (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <UserCog size={28} color={Colors.PRIMARY} />
          <Text style={styles.title}>Manage Users</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Members" value={stats?.members} />
          <StatCard label="Admins" value={stats?.admins} />
          <StatCard label="New this week" value={stats?.newMembers} />
          <StatCard label="Posts" value={stats?.posts} />
          <StatCard label="Replies" value={stats?.replies} />
          <StatCard label="Events" value={stats?.events} />
          <StatCard
            label={stats?.openReports === 1 ? 'Open report' : 'Open reports'}
            value={stats?.openReports}
            highlight={Boolean(stats?.openReports)}
            onPress={() => router.push('/admin/reports')}
          />
        </View>

        <View style={styles.toolbar}>
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search by username or alias"
            style={[styles.search, !wide && { width: '100%' }]}
            maxLength={50}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.filters}>
            {ROLE_FILTERS.map((option) => (
              <TouchableOpacity
                key={option.key || 'all'}
                style={[styles.filterChip, role === option.key && styles.filterChipActive]}
                onPress={() => {
                  setRole(option.key);
                  setPage(1);
                }}
              >
                <Text style={[styles.filterText, role === option.key && styles.filterTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {loading && !users.length ? (
          <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 24 }} />
        ) : (
          <>
            <Text style={styles.count}>
              {total === 0 ? 'No one matches.' : `Showing ${firstShown}\u2013${lastShown} of ${total}`}
            </Text>
            <View style={[styles.list, loading && { opacity: 0.6 }]}>
              {users.map((u) => {
                const name = (u.alias && u.alias.trim()) || u.username;
                const isMe = u.userUuid === user?.userUuid;
                const joined = formatJoined(u.createdAt);
                return (
                  <View key={u.userUuid} style={[styles.row, !wide && styles.rowNarrow]}>
                    <View style={styles.person}>
                      <Avatar name={name} size={40} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.nameLine}>
                          <Text style={styles.name} numberOfLines={1}>{name}</Text>
                          {u.isAdmin ? <Text style={[styles.badge, styles.badgeDark]}>Admin</Text> : null}
                          {isMe ? <Text style={styles.badge}>You</Text> : null}
                        </View>
                        <Text style={styles.sub} numberOfLines={1}>
                          {`@${u.username}`}
                          {u.relationship ? ` \u00b7 ${u.relationship}` : ''}
                          {joined ? ` \u00b7 Joined ${joined}` : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        onPress={() =>
                          isMe ? router.push('/profile') : router.push({ pathname: '/profile/view', params: { uuid: u.userUuid } })
                        }
                      >
                        <Text style={styles.linkText}>Profile</Text>
                      </TouchableOpacity>
                      {isMe ? null : (
                        <TouchableOpacity onPress={() => router.push({ pathname: '/messages', params: { with: u.userUuid } })}>
                          <Text style={styles.linkText}>Message</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => openEdit(u)}>
                        <Text style={styles.linkText}>Edit</Text>
                      </TouchableOpacity>
                      {isMe ? null : (
                        <TouchableOpacity onPress={() => confirmDelete(u)} accessibilityLabel={`Delete ${u.username}`}>
                          <Trash2 size={16} color="#dc2626" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
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
                disabled={editingSelf}
                onValueChange={(isAdminValue) => setEditForm({ ...editForm, isAdmin: isAdminValue })}
              />
            </View>
            {editingSelf ? <Text style={styles.hint}>You can&apos;t remove your own admin access. Ask another admin.</Text> : null}

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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  errorText: { color: '#dc2626', marginBottom: 12 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { flexGrow: 1, flexBasis: 110, backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 },
  statCardHighlight: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  statValueHighlight: { color: '#fff' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 },
  search: { flex: 1, minWidth: 220, backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#0f172a', fontSize: 14 },
  filters: { flexDirection: 'row', gap: 8 },
  filterChip: { borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff' },
  filterChipActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  filterText: { color: '#334155', fontWeight: '700', fontSize: 13 },
  filterTextActive: { color: '#fff' },
  count: { color: '#64748b', fontSize: 13, marginBottom: 8 },
  list: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowNarrow: { flexDirection: 'column', alignItems: 'stretch' },
  person: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 15, fontWeight: '700', color: '#0f172a', flexShrink: 1 },
  sub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badge: { backgroundColor: '#f1f5f9', color: '#334155', fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden' },
  badgeDark: { backgroundColor: '#000', color: '#fff' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
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
  hint: { color: '#64748b', fontSize: 12, marginTop: 4 },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 22 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelButtonText: { color: '#64748b', fontWeight: '700' },
  saveButton: { backgroundColor: Colors.PRIMARY, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontWeight: '700' },
});