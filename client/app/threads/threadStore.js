import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFeed, getThreadDetail, createThread, updateThread, createReply, deleteReply, deleteThread, toggleLike, toggleReplyLike, reportContent } from '../../services/threads';
import { addReplyToTree, removeReplyFromTree, updateReplyInTree, countReplies, findReply } from '../../utils/replyTree';

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
      const { threadId, reply, parentId } = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                replies: addReplyToTree(t.replies ?? [], reply, parentId),
                replyCount: (t.replyCount ?? countReplies(t.replies ?? [])) + 1,
              }
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
                replies: removeReplyFromTree(t.replies ?? [], replyId),
                replyCount: Math.max(
                  0,
                  (t.replyCount ?? countReplies(t.replies ?? [])) - (findReply(t.replies ?? [], replyId) ? 1 : 0)
                ),
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
          t.id === threadId ? { ...t, replies, repliesLoaded: true, replyCount: countReplies(replies) } : t
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
    case 'LIKE_REPLY': {
      const { threadId, replyId, liked, likeCount } = action.payload;
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === threadId
            ? { ...t, replies: updateReplyInTree(t.replies ?? [], replyId, { likes: likeCount, likedByMe: liked }) }
            : t
        ),
      };
    }
    default:
      return state;
  }
}

export function ThreadsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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

  // parentId makes it a reply to that reply; without it the reply goes at the top of the thread.
  const addReply = async (threadId, { text, imageUri, parentId }) => {
    const created = await createReply(threadId, { text, imageUri, parentId });
    dispatch({ type: 'ADD_REPLY', payload: { threadId, reply: created, parentId } });
    return created;
  };

  // Throws with status 401 when nobody is signed in; the screens send those people to log in.
  const likeReply = async (threadId, replyId) => {
    const { liked, likeCount } = await toggleReplyLike(replyId);
    dispatch({ type: 'LIKE_REPLY', payload: { threadId, replyId, liked, likeCount } });
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

  // Reloads when the visitor signs in or out, since private threads come
  // back locked for signed-out visitors and unlocked for members.
  useEffect(() => {
    if (authLoading) return;
    loadFeed();
  }, [authLoading, isAuthenticated]);

  const value = {
    state,
    actions: { loadFeed, loadThreadDetail, addThread, editThread, addReply, likeReply, removeReply, removeThread, likeThread, reportThread },
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