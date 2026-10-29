import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { getFeed, getThreadDetail, createThread, updateThread, createReply, deleteReply, deleteThread, toggleLike, reportContent } from '../../services/threads';

const ThreadsContext = createContext(null);

const initialState = {
  loading: false,
  threads: [],
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, threads: action.payload };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD_THREAD':
      return { ...state, threads: [action.payload, ...state.threads] };
    case 'UPDATE_THREAD': {
      const updated = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          // Keep the already-loaded replies; the PATCH response has none.
          t.id === updated.id
            ? { ...updated, replies: t.replies, repliesLoaded: t.repliesLoaded, likedByMe: t.likedByMe }
            : t
        ),
      };
    }
    case 'DELETE_THREAD':
      return {
        ...state,
        threads: state.threads.filter((t) => t.id !== action.payload),
      };
    case 'ADD_REPLY': {
      const { threadId, reply } = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === threadId
            ? { ...t, replies: [...t.replies, reply], replyCount: (t.replyCount ?? t.replies.length) + 1 }
            : t
        ),
      };
    }
    case 'DELETE_REPLY': {
      const { threadId, replyId } = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                replies: t.replies.filter((r) => r.id !== replyId),
                replyCount: Math.max(0, (t.replyCount ?? t.replies.length) - 1),
              }
            : t
        ),
      };
    }
    case 'SET_THREAD_REPLIES': {
      const { threadId, replies } = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === threadId ? { ...t, replies, repliesLoaded: true, replyCount: replies.length } : t
        ),
      };
    }
    case 'LIKE_THREAD': {
      const { threadId, liked, likeCount } = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === threadId ? { ...t, likes: likeCount, likedByMe: liked } : t
        ),
      };
    }
    default:
      return state;
  }
}

export function ThreadsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadFeed = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await getFeed();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e.message || 'Failed to load' });
    }
  };

  const addThread = async (data) => {
    const created = await createThread(data);
    dispatch({ type: "ADD_THREAD", payload: created });
    return created;
  };
  
  const editThread = async (threadId, data) => {
    const updated = await updateThread(threadId, data);
    dispatch({ type: 'UPDATE_THREAD', payload: updated });
    return updated;
  };

  const loadThreadDetail = async (threadId) => {
    const detail = await getThreadDetail(threadId);
    dispatch({
      type: 'SET_THREAD_REPLIES',
      payload: { threadId, replies: detail.replies },
    });
    return detail;
  };

  const addReply = async (threadId, { text, imageUri }) => {
    const created = await createReply(threadId, { text, imageUri });
    dispatch({ type: 'ADD_REPLY', payload: { threadId, reply: created } });
    return created;
  };

  const removeReply = async (threadId, replyId) => {
    await deleteReply(threadId, replyId);
    dispatch({ type: 'DELETE_REPLY', payload: { threadId, replyId } });
  };

  const removeThread = async (threadId) => {
    await deleteThread(threadId);
    dispatch({ type: 'DELETE_THREAD', payload: threadId });
  };

  const likeThread = async (threadId) => {
    // Throws with status 401 when nobody is signed in; the screens send those people to log in.
    const { liked, likeCount } = await toggleLike(threadId);
    dispatch({ type: 'LIKE_THREAD', payload: { threadId, liked, likeCount } });
  };

  const reportThread = async (threadId, reason) => {
    return reportContent(threadId, reason);
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const value = {
    state,
    actions: { loadFeed, loadThreadDetail, addThread, editThread, addReply, removeReply, removeThread, likeThread, reportThread },
  };

  return (
    <ThreadsContext.Provider value={value}>{children}</ThreadsContext.Provider>
  );
}

export function useThreads() {
  const ctx = useContext(ThreadsContext);
  if (!ctx) throw new Error('useThreads must be used within ThreadsProvider');
  return ctx;
}