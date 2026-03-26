/**
 * Simple in-memory cache for VIM file buffers.
 * Fetches a URL once, then serves cloned ArrayBuffers for subsequent loads.
 * Cloning is necessary because the viewer may transfer/consume the buffer.
 */

const cache = new Map<string, Promise<ArrayBuffer>>()

export function fetchVimBuffer (url: string): Promise<ArrayBuffer> {
  let entry = cache.get(url)
  if (!entry) {
    entry = fetch(url).then(r => r.arrayBuffer())
    cache.set(url, entry)
  }
  // Always clone so each viewer gets its own transferable buffer
  return entry.then(buf => buf.slice(0))
}
