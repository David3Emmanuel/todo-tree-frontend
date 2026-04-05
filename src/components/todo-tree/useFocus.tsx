import { useEffect, useMemo, useState } from 'react'
import { Check, FolderTree, Minus } from 'lucide-react'
import { findNode, getProgress, toggleTree } from './tree-utils'
import type { CtxValue, TreeNode } from './types'

type UseFocusOptions = {
  tree: TreeNode[]
  setTree: CtxValue['setTree']
}

type UseFocusResult = {
  focusRootId: string | null
  focusRoot: TreeNode | null
  openFocus: (nodeId: string) => void
  closeFocus: () => void
  renderFocusNode: (node: TreeNode, depth?: number) => React.ReactNode
}

export function useFocus({ tree, setTree }: UseFocusOptions): UseFocusResult {
  const [focusRootId, setFocusRootId] = useState<string | null>(null)

  const focusRoot = useMemo(
    () => (focusRootId ? findNode(tree, focusRootId) : null),
    [tree, focusRootId],
  )

  useEffect(() => {
    if (!focusRootId) {
      return
    }

    if (!focusRoot) {
      setFocusRootId(null)
    }
  }, [focusRoot, focusRootId])

  useEffect(() => {
    if (!focusRoot) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocusRootId(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusRoot])

  const renderFocusNode = (node: TreeNode, depth = 0): React.ReactNode => {
    const isFolder = node.kind === 'folder'
    const { done, total } = getProgress(node)
    const allDone = !isFolder && total > 0 && done === total
    const someDone = !isFolder && !allDone && done > 0

    return (
      <div key={node.id} className="focus-node-wrap">
        <div className="focus-node" style={{ paddingLeft: `${depth * 18}px` }}>
          <button
            className={`check${isFolder ? ' folder' : ''}${allDone ? ' done' : someDone ? ' part' : ''}`}
            onClick={() =>
              !isFolder && setTree((prev) => toggleTree(prev, node.id))
            }
            disabled={isFolder}
            title={isFolder ? 'Category (not completable)' : undefined}
          >
            {isFolder ? (
              <FolderTree className="icon-xs" aria-hidden="true" />
            ) : allDone ? (
              <Check className="icon-xs" aria-hidden="true" />
            ) : someDone ? (
              <Minus className="icon-xs" aria-hidden="true" />
            ) : null}
          </button>
          <div className="focus-node-text-wrap">
            <div
              className={`focus-node-text${isFolder ? ' folder' : ''}${allDone ? ' done' : ''}`}
            >
              {node.text || 'Untitled task'}
            </div>
            {node.children.length > 0 && (
              <div className="focus-node-meta">
                {done}/{total} complete
              </div>
            )}
          </div>
        </div>
        {node.children.length > 0 && (
          <div>
            {node.children.map((child) => renderFocusNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return {
    focusRootId,
    focusRoot,
    openFocus: setFocusRootId,
    closeFocus: () => setFocusRootId(null),
    renderFocusNode,
  }
}
