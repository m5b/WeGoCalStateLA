import { getEvents } from "./events";

// v2 adds thread categories; bumping the key re-seeds preview data so the
// FAQ and event threads show up for browsers that stored v1 data.
const STORAGE_KEY = "wego-preview-threads-v2";

export const THREAD_CATEGORIES = [
  { key: "general", label: "General" },
  { key: "events", label: "Events" },
  { key: "faq", label: "FAQs" },
];

const BASE_THREADS = [
  {
    id: "1",
    author: "WeGo Community Team",
    caption: "Welcome! What would help your family feel more connected to Cal State LA?",
    text: "Welcome! What would help your family feel more connected to Cal State LA?",
    likes: 24,
    imageUri: null,
    date: "",
    time: "",
    location: "",
    category: "general",
    createdAt: Date.now() - 1000 * 60 * 60,
    replies: [
      {
        id: "r1",
        author: "Golden Poppy",
        text: "A simple calendar of family events and important dates would help us.",
        createdAt: Date.now() - 1000 * 60 * 30,
      },
    ],
  },
  {
    id: "2",
    author: "Kind Coyote",
    caption: "What do you wish you had known when your student started at Cal State LA?",
    text: "What do you wish you had known when your student started at Cal State LA?",
    likes: 156,
    imageUri: null,
    date: "",
    time: "",
    location: "",
    category: "general",
    createdAt: Date.now() - 1000 * 60 * 10,
    replies: [
      {
        id: "r2",
        author: "Golden Oak",
        text: "I wish I had understood the academic calendar and financial-aid deadlines earlier.",
        createdAt: Date.now() - 1000 * 60 * 5,
      },
    ],
  },
];

// PLACEHOLDER FAQ DATA: replace with real FAQs once content is finalized.
const FAQ_THREADS = [
  {
    id: "faq-1",
    author: "WeGo Community Team",
    caption: "How do I find important dates like registration and financial-aid deadlines?",
    text: "Placeholder answer: Check the Cal State LA academic calendar and the Events tab here for upcoming deadlines and reminders.",
  },
  {
    id: "faq-2",
    author: "WeGo Community Team",
    caption: "Where can my student get mental health or wellness support on campus?",
    text: "Placeholder answer: The Student Health Center and counseling services offer free support. See the Events tab for wellness workshops.",
  },
  {
    id: "faq-3",
    author: "WeGo Community Team",
    caption: "Can family members attend campus events?",
    text: "Placeholder answer: Many events are open to families. Check each event's details for who can attend.",
  },
].map((faq, i) => ({
  likes: 0,
  imageUri: null,
  date: "",
  time: "",
  location: "",
  category: "faq",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * (i + 1),
  replies: [],
  ...faq,
}));

export function buildEventThread(event) {
  return {
    caption: `${event.title} — Event Discussion`,
    imageUri: event.imageUri,
    date: event.date,
    time: event.time,
    location: event.location,
    eventId: event.id,
    type: "event",
    category: "events",
    createdAt: event.createdAt ?? Date.now(),
  };
}

let THREADS = null;

function nextId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function buildSeedThreads() {
  const events = await getEvents();
  const eventThreads = events.map((event) => ({
    id: `event-${event.id}`,
    author: "WeGo Community Team",
    likes: 0,
    replies: [],
    text: "",
    ...buildEventThread(event),
  }));
  return [...BASE_THREADS, ...FAQ_THREADS, ...eventThreads];
}

// Loads threads from browser storage, or seeds them the first time.
async function ensureThreads() {
  if (THREADS) return THREADS;
  const stored = readStoredThreads();
  if (Array.isArray(stored)) {
    THREADS = stored;
  } else {
    THREADS = await buildSeedThreads();
    persistThreads();
  }
  return THREADS;
}

function readStoredThreads() {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function persistThreads() {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(THREADS));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getFeed() {
  await delay();
  await ensureThreads();
  return THREADS.map((t) => ({
    ...t,
    category: t.category ?? (t.eventId ? "events" : "general"),
    replies: t.replies ?? [],
  }));
}

export async function getThreadByEventId(eventId) {
  const threads = await getFeed();
  return threads.find((t) => String(t.eventId) === String(eventId)) ?? null;
}

export async function createThread(data) {
  await delay();
  await ensureThreads();
  const id = nextId();
  const now = Date.now();

  const thread = {
    id,
    author: "Community guest",
    likes: 0,
    replies: [],
    createdAt: now,
    text: data.caption || data.text || "",
    ...data,
    category: data.category ?? "general",
  };

  THREADS = [thread, ...THREADS];
  persistThreads();
  return thread;
}

export async function createReply(threadId, { text, imageUri = null }) {
  await delay();
  await ensureThreads();
  const thread = THREADS.find((t) => String(t.id) === String(threadId));
  if (!thread) throw new Error("Thread not found");

  const reply = {
    id: `r-${nextId()}`,
    author: "Community guest",
    text,
    imageUri,
    createdAt: Date.now(),
  };
  thread.replies = [...(thread.replies ?? []), reply];
  persistThreads();
  return reply;
}


export async function deleteThread(threadId) {
  await delay();
  await ensureThreads();
  const exists = THREADS.some((t) => String(t.id) === String(threadId));
  if (!exists) throw new Error("Thread not found");

  THREADS = THREADS.filter((t) => String(t.id) !== String(threadId));
  persistThreads();
  return { ok: true };
}

export async function deleteReply(threadId, replyId) {
  await delay();
  await ensureThreads();
  const thread = THREADS.find((t) => String(t.id) === String(threadId));
  if (!thread) throw new Error("Thread not found");

  thread.replies = (thread.replies ?? []).filter(
    (r) => String(r.id) !== String(replyId)
  );
  persistThreads();
  return { ok: true };
}

export async function toggleLike(threadId) {
  await delay();
  await ensureThreads();
  const thread = THREADS.find((t) => String(t.id) === String(threadId));
  if (!thread) throw new Error("Thread not found");

  thread.likes = (thread.likes ?? 0) + 1; 
  persistThreads();
  return thread.likes;
}

export async function reportContent(threadId, reason) {
  await delay();
  console.log("Report submitted:", { threadId, reason });
  return { ok: true };
}
