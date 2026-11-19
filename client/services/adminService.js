import { apiGet, apiJson } from './api';

// One page of people, newest first. search matches username or alias; role is 'admin' or 'member'.
// Returns { users, total } where total counts everyone who matches (not just this page).
export async function listUsers({ limit = 15, offset = 0, search = '', role = '' } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (search) params.set('search', search);
  if (role) params.set('role', role);
  const response = await apiGet(`/api/admin/users?${params.toString()}`);
  return { users: response.data.users, total: response.data.total };
}

// Totals for the top of the admin page: members, admins, new members this week, posts, replies, events, open reports.
export async function getAdminStats() {
  const response = await apiGet('/api/admin/stats');
  return response.data.stats;
}

export async function updateUser(userUuid, { alias, relationship, interests, isAdmin }) {
  const payload = {};
  if (alias !== undefined) payload.alias = alias;
  if (relationship !== undefined) payload.relationship = relationship;
  if (interests !== undefined) payload.interests = interests;
  if (isAdmin !== undefined) payload.isAdmin = isAdmin;

  const response = await apiJson(`/api/admin/users/${userUuid}`, 'PATCH', payload);
  return response.data.user;
}

export async function deleteUser(userUuid) {
  await apiJson(`/api/admin/users/${userUuid}`, 'DELETE');
}