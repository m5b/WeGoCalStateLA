// Thread API stubs for initial development
// No network calls yet — returns mock data and simulates latency

let mockThreads = [
  {
    id: 't1',
    author: 'Anonymous User',
    createdAt: Date.now() - 1000 * 60 * 120,
    text: 'Welcome to WeGo threads! Share thoughts and support each other.',
    likes: 24,
    replies: [
      {
        id: 'r1',
        author: 'Anonymous Brain',
        createdAt: Date.now() - 1000 * 60 * 90,
        text: 'Happy to be here! Remember to be kind.',
        likes: 4,
      },
    ],
  },
  {
    id: 't2',
    author: 'Anonymous Thinker',
    createdAt: Date.now() - 1000 * 60 * 240,
    text: 'Any tips for staying focused during midterms?',
    likes: 156,
    replies: [
      {
        id: 'r2',
        author: 'Anonymous Philosopher',
        createdAt: Date.now() - 1000 * 60 * 110,
        text: 'Pomodoro and breaks help a lot. Also hydrate!',
        likes: 67,
      },
    ],
  },
];

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export async function getFeed() {
  await delay();
  // Return newest first
  return mockThreads
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createThread({ text, author = 'Anonymous Eagle #' + Math.floor(Math.random() * 9999) }) {
  await delay();
  const newThread = {
    id: 't' + (Math.random().toString(36).slice(2)),
    author,
    createdAt: Date.now(),
    text,
    likes: 0,
    replies: [],
  };
  mockThreads.unshift(newThread);
  return newThread;
}

export async function createReply(threadId, { text, author = 'Anonymous' }) {
  await delay();
  const thread = mockThreads.find((t) => t.id === threadId);
  if (!thread) throw new Error('Thread not found');
  const reply = {
    id: 'r' + (Math.random().toString(36).slice(2)),
    author,
    createdAt: Date.now(),
    text,
    likes: 0,
  };
  thread.replies.push(reply);
  return reply;
}

export async function toggleLike(threadId) {
  await delay(200);
  const thread = mockThreads.find((t) => t.id === threadId);
  if (!thread) throw new Error('Thread not found');
  thread.likes = (thread.likes || 0) + 1;
  return thread.likes;
}

export async function reportContent(threadId, reason = 'inappropriate') {
  await delay(300);
  // Stub: would enqueue report to moderation service
  return { ok: true, threadId, reason };
}