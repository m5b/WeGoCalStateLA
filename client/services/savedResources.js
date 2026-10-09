// Saved resources, kept in this browser for the demo.
//
// To connect the backend later, replace the bodies of the three exported functions
// with API calls (see services/api.js). Nothing else in the app needs to change:
//   getSavedResourceIds -> apiGet('/api/resources/saved')
//   saveResource        -> apiJson(`/api/resources/saved/${resourceId}`, 'POST')
//   unsaveResource      -> apiJson(`/api/resources/saved/${resourceId}`, 'DELETE')

const STORAGE_KEY = 'wego.savedResources';

function readIds() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

function writeIds(ids) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be blocked (private browsing); saving just won't persist.
  }
}

export async function getSavedResourceIds() {
  return readIds();
}

export async function saveResource(resourceId) {
  const ids = readIds();
  if (!ids.includes(resourceId)) {
    writeIds([...ids, resourceId]);
  }
}

export async function unsaveResource(resourceId) {
  writeIds(readIds().filter((id) => id !== resourceId));
}