import { apiGet, apiJson, apiForm } from "./api";
import { getEvent } from "./events";
import { prepareImageBlob, resolveUploadUrl } from "../utils/imageData";
import { buildReplyTree } from "../utils/replyTree";

export const THREAD_CATEGORIES = [
  { key: "general", label: "General" },
  { key: "events", label: "Events" },
  // Stored as "faq" (the original name) -- shown to users as Questions.
  { key: "faq", label: "Questions" },
];

// Tags people can pick when they post. "events" is left out: those threads
// are made automatically when someone creates an event on the Events tab.
export const COMPOSER_CATEGORIES = THREAD_CATEGORIES.filter((c) => c.key !== "events");

// The server's limits for a thread's title.
export const TITLE_MIN = 10;
export const TITLE_MAX = 200;

// Checks for a well-formed thread id (the server's uuid format).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Maps a real thread (from GET /api/threads) to the shape the UI uses.
function mapThread(dto) {
  // A thread has its own title only when it wasn't generated from the body
  // by deriveTitle (older threads were posted without one). For locked
  // threads the server only sends a title the author wrote, and nothing
  // else -- see server/src/util/visibility.mjs.
  const customTitle = dto.locked
    ? dto.title || null
    : dto.title && dto.title !== deriveTitle(dto.body)
      ? dto.title
      : null;
  return {
    id: dto.threadUuid,
    author: dto.author,
    authorUuid: dto.userUuid,
    // The heading: the thread's own title, or for older threads without
    // one, the post content (their generated title has trailing dots
    // padding it out and was never meant to be displayed).
    // Private threads come back locked (content stripped) for signed-out
    // visitors, so only the title is left to show.
    caption: dto.locked
      ? customTitle || "Private conversation"
      : customTitle || dto.body,
    text: dto.locked ? "" : dto.body,
    customTitle,
    isPublic: !!dto.isPublic,
    locked: !!dto.locked,
    likes: dto.likeCount ?? 0,
    likedByMe: dto.likedByMe ?? false,
    // Sent with the feed so the count shows before the post is opened.
    replyCount: dto.replyCount ?? 0,
    // The post's cover picture (for event posts, the event's picture).
    imageUri: resolveUploadUrl(dto.photoUrl),
    date: "",
    time: "",
    location: "",
    category: dto.category || "general",
    createdAt: dto.createdAt ? new Date(dto.createdAt).getTime() : Date.now(),
    // Feed list doesn't include replies (avoids fetching every thread's
    // comments just to show the list) -- loaded on demand by
    // getThreadDetail when a thread is actually opened.
    replies: [],
  };
}

function mapComment(dto) {
  return {
    id: dto.commentUuid,
    author: dto.username,
    authorUuid: dto.userUuid,
    text: dto.content,
    // A picture attached to the reply (shown small -- see FlexibleImage maxHeight on the screens).
    imageUri: resolveUploadUrl(dto.photoUrl),
    parentId: dto.parentCommentUuid ?? null,
    likes: dto.likeCount ?? 0,
    likedByMe: !!dto.likedByMe,
    // True once the reply's text has been changed after posting (shown as "edited").
    edited: !!dto.editedAt,
    // Filled in by buildReplyTree: the replies to this reply.
    replies: [],
    createdAt: dto.createdAt ? new Date(dto.createdAt).getTime() : Date.now(),
  };
}

// How older threads got their title, before the composer asked for one: the
// start of the caption, padded to the 20 characters the server used to
// require. Used to tell those apart from real titles.
function deriveTitle(text) {
  const trimmed = (text || "").trim();
  if (trimmed.length >= 20) {
    return trimmed.length <= 200 ? trimmed : `${trimmed.slice(0, 197)}...`;
  }
  return (trimmed || "Community post").padEnd(20, ".");
}

// True for a well-formed thread id (the server's uuid format).
export function isRealThread(threadId) {
  return UUID_RE.test(String(threadId));
}

export async function getFeed() {
  const res = await apiGet("/api/threads");
  return res.data.threads.map(mapThread);
}

export async function getThreadDetail(threadId) {
  if (!UUID_RE.test(String(threadId))) {
    throw new Error("Not a valid thread id");
  }
  const res = await apiGet(`/api/comments/thread/${threadId}`);
  // The server sends every reply in one list (some repeated); build the nested replies from it.
  const replies = buildReplyTree(res.data.comments.map(mapComment));

  const dto = res.data.threadDto;
  return { ...mapThread(dto), replies };
}

export async function getThreadByEventId(eventId) {
  const event = await getEvent(eventId);
  if (!event?.threadId) return null;
  try {
    return await getThreadDetail(event.threadId);
  } catch {
    // The event's linked community post was deleted (the server now 404s
    // deleted threads) -- the event page should still load without it.
    return null;
  }
}

export async function createThread(data) {
  const content = data.caption || data.text || "";
  // Sent as a form (not JSON) so a cover photo can travel with the text.
  const formData = new FormData();
  formData.append("title", (data.title || "").trim());
  formData.append("content", content);
  formData.append("category", data.category || "general");
  formData.append("isPublic", data.isPublic ? "true" : "false");
  if (data.imageUri) {
    const blob = await prepareImageBlob(data.imageUri);
    const extension = (blob.type && blob.type.split("/")[1]) || "jpg";
    formData.append("image", blob, `cover.${extension}`);
  }
  const res = await apiForm("/api/threads/me", "POST", formData);
  return mapThread(res.data.thread);
}

// Adds a picture to a thread, or replaces the one it has. Only the thread's author (or an admin) can.
export async function setThreadPhoto(threadId, imageUri) {
  const blob = await prepareImageBlob(imageUri);
  const extension = (blob.type && blob.type.split("/")[1]) || "jpg";
  const formData = new FormData();
 formData.append("image", blob, `cover.${extension}`);
  const res = await apiForm(`/api/threads/me/${threadId}/photo`, "PUT", formData);
  return mapThread(res.data.thread);
}

export async function updateThread(threadId, data) {
  const content = data.caption || data.text || "";
  // Only the thread's author or an admin can edit it (the server checks).
  // An event's linked post is titled "<event name> — Event", which can be
  // shorter than the server allows, so if the title is too short it's left
  // as it is rather than failing to save.
  const title = (data.title || "").trim();
  const payload = { content, isPublic: !!data.isPublic };
  if (title.length >= TITLE_MIN && title.length <= TITLE_MAX) payload.title = title;
  // Event posts keep their tag; it can't be picked, so it isn't sent.
  if (data.category !== "events") payload.category = data.category || "general";
  const res = await apiJson(`/api/threads/me/${threadId}`, "PATCH", payload);
  return mapThread(res.data.thread);
}

export async function createReply(threadId, { text, imageUri, parentId }) {
  // Sent as a form (not JSON) so a picture can travel with the text. The text may be empty
  // when there is a picture.
  const formData = new FormData();
  formData.append("content", text || "");
  if (imageUri) {
    const blob = await prepareImageBlob(imageUri);
    const extension = (blob.type && blob.type.split("/")[1]) || "jpg";
    formData.append("image", blob, `reply.${extension}`);
  }
  // With parentId the reply goes under that reply; without it, at the top of the thread.
  const path = parentId
    ? `/api/comments/me/thread/${threadId}/comment/${parentId}`
    : `/api/comments/me/thread/${threadId}`;
  const res = await apiForm(path, "POST", formData);
  return mapComment(res.data.comment);
}

export async function deleteThread(threadId) {
  await apiJson(`/api/threads/me/${threadId}`, "DELETE");
  return { ok: true };
}

export async function deleteReply(threadId, replyId) {
  // threadId isn't needed by the real endpoint (a comment's id alone is
  // enough to find and delete it), kept in the signature so callers don't
  // need to change.
  await apiJson(`/api/comments/me/${replyId}`, "DELETE");
  return { ok: true };
}

// Likes the post, or takes the like back if you already liked it. Needs a signed-in
// account (the server answers 401 otherwise). Returns { liked, likeCount }.
export async function toggleLike(threadId) {
  const res = await apiJson(`/api/threads/${threadId}/like`, "POST", {});
  return res.data;
}

// Changes a reply's text. Only the person who wrote it (or an admin) can; the server checks.
export async function updateReply(replyId, text) {
  await apiJson(`/api/comments/me/${replyId}`, "PATCH", { content: text });
  return { text, edited: true };
}

// Likes a reply, or takes the like back if you already liked it. Needs a signed-in account (the
// server answers 401 otherwise). Returns { liked, likeCount }.
export async function toggleReplyLike(replyId) {
  const res = await apiJson(`/api/comments/${replyId}/like`, "POST", {});
  return res.data;
}

export async function reportContent(threadId, reason) {
  // No reports backend yet, so this does nothing.
  return { ok: false };
}