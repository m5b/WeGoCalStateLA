import { apiGet, apiJson, apiForm } from "./api";
import { getEvent } from "./events";
import { prepareImageBlob, resolveUploadUrl } from "../utils/imageData";

export const THREAD_CATEGORIES = [
  { key: "general", label: "General" },
  { key: "events", label: "Events" },
  // Stored as "faq" (the original name) -- shown to users as Questions.
  { key: "faq", label: "Questions" },
];

// Checks for a well-formed thread id (the server's uuid format).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Maps a real thread (from GET /api/threads) to the shape the UI uses.
function mapThread(dto) {
  // A thread has its own title only when it wasn't generated from the body
  // by deriveTitle -- e.g. the seeded questions, whose title is the question
  // and whose body is the answer.
  const customTitle =
    !dto.locked && dto.title && dto.title !== deriveTitle(dto.body)
      ? dto.title
      : null;
  return {
    id: dto.threadUuid,
    author: dto.author,
    authorUuid: dto.userUuid,
    // Shows the real post content, not dto.title -- the server requires a
    // 20 character title (see deriveTitle below), so title often has
    // trailing dots padding it out and was never meant to be displayed.
    // Questions with their own title are the exception: the title is the
    // question (shown as the heading) and the body is the answer.
    // Private threads come back locked (content stripped) for signed-out
    // visitors -- see server/src/util/visibility.mjs.
    caption: dto.locked
      ? "Private conversation"
      : dto.category === "faq" && customTitle ? customTitle : dto.body,
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
    text: dto.content,
    createdAt: dto.createdAt ? new Date(dto.createdAt).getTime() : Date.now(),
  };
}

// The real threads table requires a title of 20-200 characters, but the
// composer only collects one free-text caption. Pads a short caption so it
// always satisfies that, without changing what's actually shown anywhere
// (screens display .caption/.text, built from the real content, not title).
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
  const seen = new Set();
  const topLevelReplies = res.data.comments
    .filter((c) => c.parentCommentUuid == null)
    .filter((c) => {
      // the server's tree builder currently lists top-level comments twice;
      // de-dupe defensively here until that's fixed server-side
      if (seen.has(c.commentUuid)) return false;
      seen.add(c.commentUuid);
      return true;
    })
    .map(mapComment);

  const dto = res.data.threadDto;
  return { ...mapThread(dto), replies: topLevelReplies };
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
  formData.append("title", deriveTitle(content));
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

export async function updateThread(threadId, data) {
  const content = data.caption || data.text || "";
  // Anyone can edit any thread for now (see PATCH /api/threads/:threadUuid).
  // Keeps a thread's own title (e.g. a seeded question) rather than
  // replacing it with one generated from the edited body.
  const res = await apiJson(`/api/threads/${threadId}`, "PATCH", {
    title: data.customTitle || deriveTitle(content),
    content,
    category: data.category || "general",
    isPublic: !!data.isPublic,
  });
  return mapThread(res.data.thread);
}

export async function createReply(threadId, { text }) {
  const res = await apiJson(`/api/comments/me/thread/${threadId}`, "POST", {
    content: text,
  });
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

export async function reportContent(threadId, reason) {
  // No reports backend yet, so this does nothing.
  return { ok: false };
}