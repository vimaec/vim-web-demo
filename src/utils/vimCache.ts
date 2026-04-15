/**
 * Simple in-memory cache for VIM file buffers with download progress.
 * Fetches a URL once, then serves cloned ArrayBuffers for subsequent loads.
 */

type ProgressCallback = (received: number, total: number) => void

type CacheEntry = {
  promise: Promise<ArrayBuffer>
  listeners: Set<ProgressCallback>
  received: number
  total: number
  done: boolean
}

const cache = new Map<string, CacheEntry>()

export function fetchVimBuffer (url: string, onProgress?: ProgressCallback): Promise<ArrayBuffer> {
  let entry = cache.get(url)
  if (!entry) {
    entry = startFetch(url)
    cache.set(url, entry)
  }

  if (onProgress) {
    if (entry.done) {
      onProgress(entry.received, entry.total)
    } else {
      entry.listeners.add(onProgress)
      if (entry.received > 0) onProgress(entry.received, entry.total)
    }
  }

  return entry.promise.then(buf => buf.slice(0))
}

function startFetch (url: string): CacheEntry {
  const entry: CacheEntry = {
    promise: undefined as unknown as Promise<ArrayBuffer>,
    listeners: new Set(),
    received: 0,
    total: 0,
    done: false,
  }

  entry.promise = (async () => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`)
    entry.total = Number(response.headers.get('Content-Length') ?? 0)

    const reader = response.body?.getReader()
    if (!reader) return await response.arrayBuffer()

    const chunks: Uint8Array[] = []
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      entry.received += value.byteLength
      for (const cb of entry.listeners) cb(entry.received, entry.total)
    }

    const buffer = new Uint8Array(entry.received)
    let offset = 0
    for (const chunk of chunks) {
      buffer.set(chunk, offset)
      offset += chunk.byteLength
    }
    entry.done = true
    entry.listeners.clear()
    return buffer.buffer
  })()

  return entry
}
