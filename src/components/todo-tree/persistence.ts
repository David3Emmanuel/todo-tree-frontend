import type { Breadcrumb, PersistedState, TreeNode } from './types'

const DB_NAME = 'todo-tree'
const STORE_NAME = 'state'
const STATE_KEY = 'current'

function normalizeTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => {
    const kind = node.kind === 'folder' ? 'folder' : 'task'
    const children = Array.isArray(node.children)
      ? normalizeTree(node.children)
      : []

    return {
      ...node,
      kind,
      children,
      completed: kind === 'folder' ? false : Boolean(node.completed),
      collapsed: Boolean(node.collapsed),
      starred: Boolean(node.starred),
    }
  })
}

function normalizeSuggestionHides(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const result: Record<string, number> = {}
  for (const [key, rawUntil] of Object.entries(
    value as Record<string, unknown>,
  )) {
    const until = Number(rawUntil)
    if (Number.isFinite(until) && until > 0) {
      result[key] = until
    }
  }

  return result
}

function emptyPersistedState(): PersistedState {
  return { tree: [], zoom: [], view: 'tree', suggestionHides: {} }
}

function normalizePersistedState(value: unknown): PersistedState {
  const parsed = (value ?? {}) as Partial<PersistedState> & {
    suggestionHides?: unknown
  }

  return {
    tree:
      Array.isArray(parsed.tree) && parsed.tree.length
        ? normalizeTree(parsed.tree as TreeNode[])
        : [],
    zoom: Array.isArray(parsed.zoom) ? (parsed.zoom as Breadcrumb[]) : [],
    view: parsed.view === 'harvest' ? 'harvest' : 'tree',
    suggestionHides: normalizeSuggestionHides(parsed.suggestionHides),
  }
}

function openIndexedDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to open IndexedDB'))
    }
  })
}

async function readStateFromIndexedDb(): Promise<PersistedState | null> {
  const db = await openIndexedDb()
  if (!db) {
    return null
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(STATE_KEY)

    request.onsuccess = () => {
      db.close()
      if (!request.result) {
        resolve(null)
        return
      }

      resolve(normalizePersistedState(request.result))
    }

    request.onerror = () => {
      db.close()
      reject(request.error ?? new Error('Failed to read IndexedDB state'))
    }
  })
}

async function writeStateToIndexedDb(state: PersistedState): Promise<void> {
  const db = await openIndexedDb()
  if (!db) {
    return
  }

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.put(state, STATE_KEY)

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onerror = () => {
      db.close()
      reject(transaction.error ?? new Error('Failed to write IndexedDB state'))
    }
  })
}

export async function loadPersistedState(): Promise<PersistedState> {
  const indexedDbState = await readStateFromIndexedDb()
  if (indexedDbState) {
    return indexedDbState
  }

  return emptyPersistedState()
}

export async function savePersistedState(state: PersistedState): Promise<void> {
  await writeStateToIndexedDb(state)
}
