import { apiGet, apiJson } from './api';

export async function getProfile() {
  const response = await apiGet('/api/user/me');
  return response.data.user;
}

export async function updateProfile({ alias, relationship, interests }) {
  const payload = {};
  if (alias !== undefined) payload.alias = alias;
  if (relationship !== undefined) payload.relationship = relationship;
  if (interests !== undefined) payload.interests = interests;

  const response = await apiJson('/api/user/me', 'PATCH', payload);
  return response.data.user;
}