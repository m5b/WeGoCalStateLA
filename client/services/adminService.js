import { apiGet, apiJson } from './api';

export async function listUsers() {
  const response = await apiGet('/api/admin/users');
  return response.data.users;
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