import { apiGet, apiForm } from './api';
import { prepareImageBlob, resolveUploadUrl } from '../utils/imageData';

// Maps the server's event shape to the field names the client screens use.
function mapEvent(dto) {
  return {
    id: dto.id,
    title: dto.title,
    caption: dto.caption,
    description: dto.description,
    text: dto.text,
    imageUri: resolveUploadUrl(dto.imageUri),
    date: dto.date,
    time: dto.time,
    location: dto.location,
    author: dto.author,
    authorUuid: dto.authorUuid,
    threadId: dto.threadId,
    isPublic: !!dto.isPublic,
    // Private events come back locked (details stripped) for signed-out
    // visitors -- see server/src/util/visibility.mjs.
    locked: !!dto.locked,
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

// Reads a local image URI (from the picker) as a Blob, shrinking big photos
// first (see prepareImageBlob), so it can be attached to the upload's FormData.
async function uriToBlob(imageUri) {
  return prepareImageBlob(imageUri);
}

function buildEventForm(data) {
  const formData = new FormData();
  formData.append('title', data.title || data.caption || '');
  formData.append('description', data.description || data.text || '');
  formData.append('date', data.date || '');
  formData.append('time', data.time || '');
  formData.append('location', data.location || '');
  formData.append('isPublic', data.isPublic ? 'true' : 'false');
  return formData;
}

async function appendImage(formData, imageUri) {
  const blob = await uriToBlob(imageUri);
  const extension = (blob.type && blob.type.split('/')[1]) || 'jpg';
  formData.append('image', blob, `cover.${extension}`);
}

// Creates an event (and, server-side, its linked community post) in one
// call. Sends multipart/form-data so the image can go along as raw bytes.
export async function createEvent(data) {
  const formData = buildEventForm(data);
  if (data.imageUri) await appendImage(formData, data.imageUri);

  const res = await apiForm('/api/events/me', 'POST', formData);
  return mapEvent(res.data.event);
}

// Edits an event the signed-in user created (the server also updates its
// linked community post). Only uploads an image when a new one was picked,
// i.e. not the already-hosted cover passed back in as existingImageUri.
export async function updateEvent(eventId, data) {
  const formData = buildEventForm(data);
  if (data.imageUri && data.imageUri !== data.existingImageUri) {
    await appendImage(formData, data.imageUri);
  }

  const res = await apiForm(`/api/events/me/${eventId}`, 'PATCH', formData);
  return mapEvent(res.data.event);
}