const STORAGE_KEY = "wego-preview-threads-v1";
let NEXT_ID = 3;

let THREADS = [
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
  const stored = readStoredThreads();
  if (Array.isArray(stored)) THREADS = stored;
  return THREADS.map((t) => ({
    replies: [],
    ...t,
    replies: t.replies ?? [],
  }));
}

export async function createThread(data) {
  await delay();
  const id = String(NEXT_ID++);
  const now = Date.now();

  const thread = {
    id,
    author: "Community guest",
    likes: 0,
    replies: [],
    createdAt: now,
    text: data.caption || data.text || "",
    ...data,
  };

  THREADS = [thread, ...THREADS];
  persistThreads();
  return thread;
}

export async function createReply(threadId, { text }) {
  await delay();
  const thread = THREADS.find((t) => String(t.id) === String(threadId));
  if (!thread) throw new Error("Thread not found");

  const reply = {
    id: `r-${thread.id}-${(thread.replies?.length ?? 0) + 1}`,
    author: "Community guest",
    text,
    createdAt: Date.now(),
  };
  thread.replies = [...(thread.replies ?? []), reply];
  persistThreads();
  return reply;
}


export async function toggleLike(threadId) {
  await delay();
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
