import { apiGet, apiJson } from './api';

// Someone's profile card: who they are, when they joined, what they've contributed, and their recent posts and
// events. Others see only what is public; your own profile also includes your private posts and events.
export async function getPublicProfile(userUuid) {
  const response = await apiGet(`/api/user/public/${userUuid}`);
  return response.data.profile;
}

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