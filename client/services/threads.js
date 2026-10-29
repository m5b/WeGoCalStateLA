import { apiGet, apiJson } from "./api";
import { getEvent } from "./events";

export const THREAD_CATEGORIES = [
  { key: "general", label: "General" },
  { key: "events", label: "Events" },
  { key: "faq", label: "FAQs" },
];

// Checks for a well-formed thread id (the server's uuid format).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Maps a real thread (from GET /api/threads) to the shape the UI uses.
function mapThread(dto) {
  return {
    id: dto.threadUuid,
    author: dto.author,
    authorUuid: dto.userUuid,
    // Shows the real post content, not dto.title -- the server requires a
    // 20+ character title (see deriveTitle below), so title often has
    // trailing dots padding it out and was never meant to be displayed.
    // FAQs are the exception: their title is the question (shown as the
    // heading) and their body is the answer.
    caption: dto.category === "faq" ? dto.title : dto.body,
    text: dto.body,
    likes: dto.likeCount ?? 0,
    likedByMe: dto.likedByMe ?? false,
    // Sent with the feed so the count shows before the post is opened.
    replyCount: dto.replyCount ?? 0,
    imageUri: null, // threads don't support image attachments yet
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
    return trimmed.length <= 200 ? trimmed : trimmed.slice(0, 197) + "...";
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
  const res = await apiJson("/api/threads/me", "POST", {
    title: deriveTitle(content),
    content,
    category: data.category || "general",
  });
  // Note: data.imageUri is intentionally not sent -- the real threads table
  // has no image column yet, so a photo attached in the composer currently
  // isn't persisted.
  return mapThread(res.data.thread);
}

export async function updateThread(threadId, data) {
  const content = data.caption || data.text || "";
  // Anyone can edit any thread for now (see PATCH /api/threads/:threadUuid).
  const res = await apiJson(`/api/threads/${threadId}`, "PATCH", {
    title: deriveTitle(content),
    content,
    category: data.category || "general",
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