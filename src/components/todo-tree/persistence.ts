import { INIT } from './init-data'
import type { Breadcrumb, PersistedState, TreeNode } from './types'

const STORAGE_KEY = 'todo-tree-state'

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

export function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') {
    return { tree: INIT, zoom: [], view: 'tree' }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { tree: INIT, zoom: [], view: 'tree' }
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      tree:
        Array.isArray(parsed.tree) && parsed.tree.length
          ? normalizeTree(parsed.tree as TreeNode[])
          : INIT,
      zoom: Array.isArray(parsed.zoom) ? (parsed.zoom as Breadcrumb[]) : [],
      view: parsed.view === 'harvest' ? 'harvest' : 'tree',
    }
  } catch {
    return { tree: INIT, zoom: [], view: 'tree' }
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
