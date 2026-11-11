import { apiGet, apiJson, apiForm, API_BASE_URL } from "./api";
import { prepareImageBlob } from "../utils/imageData";

// Pictures in messages are private: the server only gives them to the two people in the conversation,
// so the address goes through the API (the browser sends your login with it).
const withPhoto = (message) => ({
  ...message,
  photoUrl: message.photoUrl ? `${API_BASE_URL}${message.photoUrl}` : null,
  createdAt: message.createdAt ? new Date(message.createdAt).getTime() : null,
});

export async function getUnreadCount() {
  const res = await apiGet("/api/messages/unread-count");
  return res.data.unread;
}

export async function searchPeople(query) {
  const res = await apiGet(`/api/messages/people?q=${encodeURIComponent(query)}`);
  return res.data.people;
}

export async function getConversations() {
  const res = await apiGet("/api/messages/conversations");
  return res.data.conversations.map((c) => ({
    ...c,
    lastMessage: { ...c.lastMessage, createdAt: new Date(c.lastMessage.createdAt).getTime() },
  }));
}

// Opens a conversation; their messages to you are marked as read.
export async function getConversation(userUuid) {
  const res = await apiGet(`/api/messages/with/${userUuid}`);
  return { person: res.data.person, messages: res.data.messages.map(withPhoto) };
}

// Sends text, a picture, or both. The text may be empty when there is a picture.
export async function sendMessage(userUuid, { text, imageUri }) {
  const formData = new FormData();
  formData.append("content", text || "");
  if (imageUri) {
    const blob = await prepareImageBlob(imageUri);
    const extension = (blob.type && blob.type.split("/")[1]) || "jpg";
    formData.append("image", blob, `message.${extension}`);
  }
  const res = await apiForm(`/api/messages/with/${userUuid}`, "POST", formData);
  return withPhoto(res.data.message);
}

export async function deleteMessage(messageUuid) {
  await apiJson(`/api/messages/${messageUuid}`, "DELETE");
}

export async function blockUser(userUuid) {
  await apiJson(`/api/messages/blocks/${userUuid}`, "PUT", {});
}

export async function unblockUser(userUuid) {
  await apiJson(`/api/messages/blocks/${userUuid}`, "DELETE");
}

// Sends a message you received to the admins, with your reason.
export async function reportMessage(messageUuid, reason) {
  await apiJson(`/api/messages/${messageUuid}/report`, "POST", { reason });
}

// ---- admins ----
export async function listReports({ includeResolved = false } = {}) {
  const res = await apiGet(`/api/messages/reports${includeResolved ? "?all=1" : ""}`);
  return res.data.reports.map((r) => ({
    ...r,
    photoUrl: r.photoUrl ? `${API_BASE_URL}${r.photoUrl}` : null,
    createdAt: new Date(r.createdAt).getTime(),
  }));
}

export async function resolveReport(reportUuid) {
  await apiJson(`/api/messages/reports/${reportUuid}/resolve`, "PATCH", {});
}