// Replies can have replies of their own. A reply here looks like
// { id, parentId, createdAt, replies: [...], ... }, and a thread keeps the top-level list.

// Turns the server's flat list of replies into a tree. A reply whose parent isn't in the list
// (the parent was deleted) goes at the top level. Repeats in the list are ignored.
export function buildReplyTree(flat) {
  const byId = new Map();
  for (const reply of flat) {
    if (!byId.has(reply.id)) byId.set(reply.id, { ...reply, replies: [] });
  }
  const top = [];
  for (const reply of byId.values()) {
    const parent = reply.parentId ? byId.get(reply.parentId) : null;
    (parent ? parent.replies : top).push(reply);
  }
  return top;
}

function mapTree(tree, fn) {
  return tree.map((reply) => {
    const updated = fn(reply);
    return { ...updated, replies: mapTree(updated.replies ?? [], fn) };
  });
}

export function findReply(tree, id) {
  for (const reply of tree) {
    if (reply.id === id) return reply;
    const inside = findReply(reply.replies ?? [], id);
    if (inside) return inside;
  }
  return null;
}

// Adds a reply under `parentId`, or at the top level when there is no parent (or it isn't found).
export function addReplyToTree(tree, reply, parentId) {
  const node = { ...reply, replies: reply.replies ?? [] };
  if (!parentId || !findReply(tree, parentId)) return [...tree, node];
  return mapTree(tree, (r) =>
    r.id === parentId ? { ...r, replies: [...(r.replies ?? []), node] } : r
  );
}

// Removes a reply. Replies to it move up to the top level, the same as the server does after a
// delete, so what you see now matches what you see after a reload.
export function removeReplyFromTree(tree, id) {
  const promoted = [];
  const prune = (list) =>
    list
      .filter((r) => {
        if (r.id !== id) return true;
        promoted.push(...(r.replies ?? []));
        return false;
      })
      .map((r) => ({ ...r, replies: prune(r.replies ?? []) }));
  const pruned = prune(tree);
  return promoted.length
    ? [...pruned, ...promoted].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
    : pruned;
}

// Changes one reply. `patch` is an object of new values, or a function that gets the reply
// and returns them.
export function updateReplyInTree(tree, id, patch) {
  return mapTree(tree, (r) =>
    r.id === id ? { ...r, ...(typeof patch === "function" ? patch(r) : patch) } : r
  );
}

// How many replies there are in total, counting replies to replies.
export function countReplies(tree) {
  return tree.reduce((total, r) => total + 1 + countReplies(r.replies ?? []), 0);
}