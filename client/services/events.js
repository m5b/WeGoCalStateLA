import { apiGet, apiForm } from './api';

// Maps the server's event shape to the field names the client screens use.
function mapEvent(dto) {
  return {
    id: dto.id,
    title: dto.title,
    caption: dto.caption,
    description: dto.description,
    text: dto.text,
    imageUri: dto.imageUri,
    date: dto.date,
    time: dto.time,
    location: dto.location,
    author: dto.author,
    authorUuid: dto.authorUuid,
    threadId: dto.threadId,
    createdAt: dto.createdAt,
  };
}

export async function getEvents() {
  const res = await apiGet('/api/events');
  return res.data.events.map(mapEvent);
}

export async function getEvent(eventId) {
  const res = await apiGet(`/api/events/${eventId}`);
  return mapEvent(res.data.event);
}

// Reads a local image URI (from the picker) as a Blob, so it can be
// attached to the upload's FormData.
async function uriToBlob(imageUri) {
  const response = await fetch(imageUri);
  return response.blob();
}

// Creates an event (and, server-side, its linked community post) in one
// call. Sends multipart/form-data so the image can go along as raw bytes.
export async function createEvent(data) {
  const formData = new FormData();
  formData.append('title', data.title || data.caption || '');
  formData.append('description', data.description || data.text || '');
  formData.append('date', data.date || '');
  formData.append('time', data.time || '');
  formData.append('location', data.location || '');

  if (data.imageUri) {
    const blob = await uriToBlob(data.imageUri);
    const extension = (blob.type && blob.type.split('/')[1]) || 'jpg';
    formData.append('image', blob, `cover.${extension}`);
  }

  const res = await apiForm('/api/events/me', 'POST', formData);
  return mapEvent(res.data.event);
}