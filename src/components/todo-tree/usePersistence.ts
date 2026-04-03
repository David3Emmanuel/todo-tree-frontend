import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

import { loadPersistedState, savePersistedState } from './persistence'
import type { Breadcrumb, TreeNode, ViewMode } from './types'

function pruneSuggestionHides(
  hides: Record<string, number>,
  now: number,
): Record<string, number> {
  const result: Record<string, number> = {}

  for (const [key, until] of Object.entries(hides)) {
    if (until > now) {
      result[key] = until
    }
  }

  return result
}

export type UsePersistenceResult = {
  isReady: boolean
  tree: TreeNode[]
  setTree: Dispatch<SetStateAction<TreeNode[]>>
  zoom: Breadcrumb[]
  setZoom: Dispatch<SetStateAction<Breadcrumb[]>>
  view: ViewMode
  setView: Dispatch<SetStateAction<ViewMode>>
  suggestionHides: Record<string, number>
  setSuggestionHides: Dispatch<SetStateAction<Record<string, number>>>
  activeSuggestionHides: Record<string, number>
  suggestionTick: number
  setSuggestionTick: Dispatch<SetStateAction<number>>
}

export function usePersistence(isAuthenticated: boolean): UsePersistenceResult {
  const [isReady, setIsReady] = useState(false)
  const [tree, setTree] = useState<TreeNode[]>([])
  const [zoom, setZoom] = useState<Breadcrumb[]>([])
  const [view, setView] = useState<ViewMode>('tree')
  const [suggestionHides, setSuggestionHides] = useState<
    Record<string, number>
  >({})
  const [suggestionTick, setSuggestionTick] = useState(() => Date.now())

  useEffect(() => {
    let isCancelled = false

    if (!isAuthenticated) {
      setIsReady(false)
      return () => {
        isCancelled = true
      }
    }

    setIsReady(false)

    void (async () => {
      const persisted = await loadPersistedState()
      if (isCancelled) {
        return
      }

      setTree(persisted.tree)
      setZoom(persisted.zoom)
      setView(persisted.view)
      setSuggestionHides(persisted.suggestionHides ?? {})
      setSuggestionTick(Date.now())
      setIsReady(true)
    })()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated])

  const activeSuggestionHides = useMemo(
    () => pruneSuggestionHides(suggestionHides, suggestionTick),
    [suggestionHides, suggestionTick],
  )

  useEffect(() => {
    if (!isAuthenticated || !isReady) {
      return
    }

    void savePersistedState({
      tree,
      zoom,
      view,
      suggestionHides: activeSuggestionHides,
    }).catch(() => {
      // Offline-first behavior should not block editing on persistence errors.
    })
  }, [isAuthenticated, isReady, tree, zoom, view, activeSuggestionHides])

  useEffect(() => {
    const activeExpiryTimes = Object.values(activeSuggestionHides)
    if (!activeExpiryTimes.length) {
      return
    }

    const nextExpiry = Math.min(...activeExpiryTimes)
    const delay = Math.max(25, nextExpiry - Date.now() + 25)
    const timeoutId = window.setTimeout(() => {
      setSuggestionTick(Date.now())
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [activeSuggestionHides])

  return {
    isReady,
    tree,
    setTree,
    zoom,
    setZoom,
    view,
    setView,
    suggestionHides,
    setSuggestionHides,
    activeSuggestionHides,
    suggestionTick,
    setSuggestionTick,
  }
}
