import { useTodoCtx } from './todo-context'
import { getAllStarred, getProgress, toggleTree, upd } from './tree-utils'

export function HarvestView() {
  const { tree, setTree } = useTodoCtx()
  const items = getAllStarred(tree)

  if (!items.length) {
    return (
      <div className="empty">
        <div style={{ fontSize: 44, opacity: 0.15 }}>★</div>
        <div>No pinned tasks yet</div>
        <div style={{ fontSize: 12, color: '#928c86' }}>
          Star tasks in the Tree view to harvest them here
        </div>
      </div>
    )
  }

  return (
    <div className="harvest">
      <div className="harvest-hint">
        Starred tasks harvested from across your tree
      </div>
      {items.map((item) => {
        const isFolder = item.kind === 'folder'
        const { done, total } = getProgress(item)
        const allDone = !isFolder && total > 0 && done === total
        return (
          <div key={item.id} className="h-item">
            <button
              className={`check${isFolder ? ' folder' : ''}${allDone ? ' done' : ''}`}
              style={{ flexShrink: 0 }}
              onClick={() =>
                !isFolder && setTree((prev) => toggleTree(prev, item.id))
              }
              disabled={isFolder}
              title={isFolder ? 'Category (not completable)' : undefined}
            >
              {isFolder ? '∞' : allDone && '✓'}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: 14,
                  color: isFolder ? '#d9cbab' : allDone ? '#928c86' : '#e6dfd6',
                  textDecoration:
                    !isFolder && allDone ? 'line-through' : 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.text}
              </div>
              {item._path.length > 0 && (
                <div className="h-path">{item._path.join(' > ')}</div>
              )}
            </div>
            <button
              className="act starred"
              title="Unpin"
              onClick={() =>
                setTree((prev) =>
                  upd(prev, item.id, (target) => {
                    target.starred = false
                  }),
                )
              }
            >
              ★
            </button>
          </div>
        )
      })}
    </div>
  )
}
