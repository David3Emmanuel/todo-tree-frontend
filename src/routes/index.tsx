import { createFileRoute } from '@tanstack/react-router'
import { createContext, useContext, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Courier+Prime:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }

.app {
  min-height: 100vh;
  background: #0f0e0d;
  color: #e6dfd6;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 760px;
  margin: 0 auto;
}

.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 18px;
  border-bottom: 1px solid #1c1b1a;
  position: sticky; top: 0; background: #0f0e0d; z-index: 10;
}
.brand { display: flex; align-items: center; gap: 9px; }
.brand-icon { color: #cf7d3c; font-size: 20px; line-height: 1; }
.brand-name { font-size: 15px; font-weight: 600; letter-spacing: -0.3px; }
.brand-sub { font-size: 10px; color: #3a3835; margin-top: 1px; font-weight: 400; letter-spacing: 0.8px; text-transform: uppercase; }

.tabs { display: flex; gap: 2px; background: #181716; padding: 3px; border-radius: 8px; }
.tab {
  padding: 5px 14px; border-radius: 6px; border: none; background: none;
  color: #4e4b48; font-family: 'Outfit', sans-serif; font-size: 13px;
  cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px;
}
.tab.active { background: #222120; color: #e6dfd6; }
.tab:hover:not(.active) { color: #8a8582; }

.badge {
  background: #cf7d3c; color: #0f0e0d; font-size: 10px; font-weight: 700;
  padding: 1px 5px; border-radius: 99px; min-width: 17px; text-align: center;
}

.breadcrumbs {
  display: flex; align-items: center; gap: 2px; flex-wrap: nowrap;
  padding: 8px 18px; border-bottom: 1px solid #181716; overflow-x: auto; scrollbar-width: none;
  background: #0c0b0a;
}
.crumb {
  background: none; border: none; color: #4e4b48;
  font-family: 'Outfit', sans-serif; font-size: 12px;
  cursor: pointer; padding: 2px 6px; border-radius: 4px;
  transition: color 0.15s; white-space: nowrap;
}
.crumb:hover { color: #e6dfd6; }
.crumb.cur { color: #cf7d3c; cursor: default; }
.sep { color: #252321; font-size: 14px; line-height: 1; }

.main { flex: 1; padding: 6px 4px; overflow-y: auto; }

.node {
  display: flex; align-items: center; gap: 4px;
  padding: 3px 8px 3px 0; border-radius: 6px;
  position: relative; transition: background 0.1s;
}
.node:hover { background: #131211; }
.node:hover .actions { opacity: 1; }
.node.drop-inside { background: rgba(207,125,60,0.07); }

.expand-btn {
  background: none; border: none; cursor: pointer;
  color: #3a3835; padding: 2px 3px; border-radius: 3px;
  line-height: 1; flex-shrink: 0; width: 16px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s; font-size: 8px;
}
.expand-btn:hover { color: #7a7572; }
.expand-btn .arr { display: inline-block; transition: transform 0.15s; }
.expand-btn.open .arr { transform: rotate(90deg); }

.check {
  width: 15px; height: 15px; border-radius: 4px;
  border: 1.5px solid #333130; background: none; cursor: pointer;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-size: 8px; font-weight: 800; color: #0f0e0d;
  transition: all 0.18s;
}
.check:hover:not(.done) { border-color: #666360; }
.check.done { background: #5a8f60; border-color: #5a8f60; }
.check.part { border-color: #cf7d3c; }

.node-input {
  flex: 1; background: none; border: none; outline: none;
  color: #e6dfd6; font-family: 'Courier Prime', 'Courier New', monospace;
  font-size: 14px; padding: 0; min-width: 0; line-height: 1.5;
}

.node-text {
  flex: 1; cursor: text; color: #e6dfd6;
  font-family: 'Courier Prime', 'Courier New', monospace; font-size: 14px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  user-select: none; line-height: 1.5;
}
.node-text.done { color: #333130; text-decoration: line-through; }
.node-text .ph { color: #282624; font-style: italic; font-size: 13px; }

.prog { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
.prog-track { width: 42px; height: 3px; background: #1e1c1b; border-radius: 99px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 99px; transition: width 0.35s cubic-bezier(0.4,0,0.2,1); }
.prog-label { font-size: 10px; color: #4e4b48; font-family: 'Courier Prime', monospace; min-width: 24px; }

.collapsed-count {
  font-size: 10px; color: #3a3835; background: #181716;
  padding: 1px 6px; border-radius: 99px; flex-shrink: 0;
  font-family: 'Courier Prime', monospace;
}

.actions { display: flex; gap: 1px; opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
.act {
  background: none; border: none; cursor: pointer;
  color: #2e2c2a; font-size: 12px; padding: 2px 4px;
  border-radius: 3px; line-height: 1; transition: color 0.15s;
}
.act:hover { color: #8a8582; }
.act.starred { color: #e8c547; }
.act.del:hover { color: #b85a5a; }
.act.zoom:hover { color: #cf7d3c; }

.drop-line { height: 2px; background: #cf7d3c; border-radius: 1px; margin: 1px 0; }

.footer {
  padding: 10px 16px; border-top: 1px solid #181716;
  position: sticky; bottom: 0; background: #0f0e0d;
}
.btn-add-root {
  width: 100%; background: none; border: 1px dashed #222120;
  color: #4e4b48; padding: 8px; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 13px;
  cursor: pointer; transition: all 0.15s;
}
.btn-add-root:hover { border-color: #cf7d3c; color: #cf7d3c; }

.empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 260px; gap: 10px; color: #3a3835;
  font-size: 14px;
}
.btn-start {
  margin-top: 4px; background: #cf7d3c; color: #0f0e0d;
  border: none; padding: 8px 22px; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: opacity 0.15s;
}
.btn-start:hover { opacity: 0.85; }

.harvest { padding: 8px 10px; }
.harvest-hint { font-size: 11px; color: #2e2c2a; margin-bottom: 14px; padding: 0 6px; font-style: italic; }
.h-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 8px;
  border: 1px solid #191817; background: #111010;
  margin-bottom: 7px; transition: border-color 0.15s;
}
.h-item:hover { border-color: #252321; }
.h-path { font-size: 11px; color: #332f2c; margin-top: 2px; }

.shortcuts {
  display: flex; gap: 14px; padding: 10px 18px;
  border-top: 1px solid #181716; flex-wrap: wrap;
}
.shortcut { font-size: 11px; color: #2e2c2a; display: flex; align-items: center; gap: 5px; }
.key {
  background: #181716; border: 1px solid #222120; border-radius: 4px;
  padding: 1px 5px; font-family: 'Courier Prime', monospace; font-size: 10px;
  color: #4e4b48;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #222120; border-radius: 2px; }
`

type TreeNode = {
  id: string
  text: string
  completed: boolean
  collapsed: boolean
  starred: boolean
  children: TreeNode[]
}

type Breadcrumb = {
  id: string
  text: string
}

type DropPosition = 'before' | 'after' | 'inside'

type StarredItem = TreeNode & {
  _path: string[]
}

type CtxValue = {
  tree: TreeNode[]
  setTree: React.Dispatch<React.SetStateAction<TreeNode[]>>
  editingId: string | null
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>
  zoom: Breadcrumb[]
  setZoom: React.Dispatch<React.SetStateAction<Breadcrumb[]>>
}

const uid = () => Math.random().toString(36).slice(2, 9)
const dc = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T
const makeNode = (): TreeNode => ({
  id: uid(),
  text: '',
  completed: false,
  collapsed: false,
  starred: false,
  children: [],
})

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNode(node.children ?? [], id)
    if (found) return found
  }
  return null
}

function getLeaves(node: TreeNode): TreeNode[] {
  if (!node.children.length) return [node]
  return node.children.flatMap(getLeaves)
}

function getProgress(node: TreeNode): {
  done: number
  total: number
  isLeaf: boolean
} {
  if (!node.children.length) {
    return { done: node.completed ? 1 : 0, total: 1, isLeaf: true }
  }

  const leaves = getLeaves(node)
  const done = leaves.filter((leaf) => leaf.completed).length
  return { done, total: leaves.length, isLeaf: false }
}

function countDescendants(node: TreeNode): number {
  if (!node.children.length) return 0
  return (
    node.children.length +
    node.children.reduce((sum, child) => sum + countDescendants(child), 0)
  )
}

function getAllStarred(nodes: TreeNode[], path: string[] = []): StarredItem[] {
  const result: StarredItem[] = []
  for (const node of nodes) {
    const nextPath = [...path, node.text]
    if (node.starred) result.push({ ...node, _path: path })
    result.push(...getAllStarred(node.children, nextPath))
  }
  return result
}

function upd(
  tree: TreeNode[],
  id: string,
  fn: (node: TreeNode) => void,
): TreeNode[] {
  const clone = dc(tree)
  const walk = (nodes: TreeNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === id) {
        fn(node)
        return true
      }
      if (walk(node.children)) return true
    }
    return false
  }
  walk(clone)
  return clone
}

function rem(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({ ...node, children: rem(node.children, id) }))
}

function propagate(nodes: TreeNode[]): void {
  for (const node of nodes) {
    if (node.children.length) {
      propagate(node.children)
      node.completed = node.children.every((child) => child.completed)
    }
  }
}

function toggleTree(tree: TreeNode[], id: string): TreeNode[] {
  const clone = dc(tree)

  function walk(nodes: TreeNode[]): boolean {
    for (const node of nodes) {
      if (node.id === id) {
        if (!node.children.length) {
          node.completed = !node.completed
        } else {
          const allDone = getLeaves(node).every((leaf) => leaf.completed)
          const setAll = (target: TreeNode, value: boolean): void => {
            if (!target.children.length) {
              target.completed = value
            } else {
              target.children.forEach((child) => setAll(child, value))
            }
          }
          setAll(node, !allDone)
        }
        return true
      }
      if (walk(node.children)) return true
    }
    return false
  }

  walk(clone)
  propagate(clone)
  return clone
}

function addSib(
  tree: TreeNode[],
  afterId: string,
  newNode: TreeNode,
): TreeNode[] {
  const clone = dc(tree)
  const insert = (nodes: TreeNode[]): boolean => {
    const index = nodes.findIndex((node) => node.id === afterId)
    if (index !== -1) {
      nodes.splice(index + 1, 0, newNode)
      return true
    }
    for (const node of nodes) {
      if (insert(node.children)) return true
    }
    return false
  }
  if (!insert(clone)) clone.push(newNode)
  return clone
}

function indentN(tree: TreeNode[], id: string): TreeNode[] {
  const clone = dc(tree)
  const walk = (nodes: TreeNode[]): boolean => {
    const index = nodes.findIndex((node) => node.id === id)
    if (index > 0) {
      const [node] = nodes.splice(index, 1)
      const parent = nodes[index - 1]
      parent.children.push(node)
      parent.collapsed = false
      return true
    }
    for (const node of nodes) {
      if (walk(node.children)) return true
    }
    return false
  }
  return walk(clone) ? clone : tree
}

function outdentN(tree: TreeNode[], id: string): TreeNode[] {
  const clone = dc(tree)
  const walk = (nodes: TreeNode[]): boolean => {
    for (let index = 0; index < nodes.length; index += 1) {
      const children = nodes[index].children
      const childIndex = children.findIndex((child) => child.id === id)
      if (childIndex !== -1) {
        const [node] = children.splice(childIndex, 1)
        nodes.splice(index + 1, 0, node)
        return true
      }
      if (walk(children)) return true
    }
    return false
  }
  return walk(clone) ? clone : tree
}

function moveN(
  tree: TreeNode[],
  dragId: string,
  targetId: string,
  pos: DropPosition,
): TreeNode[] {
  if (dragId === targetId) return tree

  const clone = dc(tree)
  let dragged: TreeNode | null = null

  const extract = (nodes: TreeNode[]): boolean => {
    const index = nodes.findIndex((node) => node.id === dragId)
    if (index !== -1) {
      ;[dragged] = nodes.splice(index, 1)
      return true
    }
    for (const node of nodes) {
      if (extract(node.children)) return true
    }
    return false
  }

  extract(clone)
  if (!dragged) return tree

  const insert = (nodes: TreeNode[]): boolean => {
    const index = nodes.findIndex((node) => node.id === targetId)
    if (index !== -1) {
      if (pos === 'before') {
        nodes.splice(index, 0, dragged as TreeNode)
      } else if (pos === 'after') {
        nodes.splice(index + 1, 0, dragged as TreeNode)
      } else {
        nodes[index].children.push(dragged as TreeNode)
        nodes[index].collapsed = false
      }
      return true
    }
    for (const node of nodes) {
      if (insert(node.children)) return true
    }
    return false
  }

  insert(clone)
  return clone
}

const Ctx = createContext<CtxValue | null>(null)

function useTodoCtx(): CtxValue {
  const value = useContext(Ctx)
  if (!value) throw new Error('TodoTree context not initialized')
  return value
}

function Node({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const { setTree, editingId, setEditingId, setZoom } = useTodoCtx()
  const [dropPos, setDropPos] = useState<DropPosition | null>(null)

  const hasKids = node.children.length > 0
  const { done, total, isLeaf } = getProgress(node)
  const allDone = total > 0 && done === total
  const someDone = !allDone && done > 0
  const isEditing = editingId === node.id
  const paddingLeft = 14 + depth * 22

  const onKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const nextNode = makeNode()
      setTree((prev) => addSib(prev, node.id, nextNode))
      setEditingId(nextNode.id)
    } else if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      setTree((prev) => indentN(prev, node.id))
    } else if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      setTree((prev) => outdentN(prev, node.id))
    } else if (event.key === 'Backspace' && node.text === '') {
      event.preventDefault()
      setTree((prev) => rem(prev, node.id))
      setEditingId(null)
    } else if (event.key === 'Escape') {
      setEditingId(null)
    }
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const { top, height } = event.currentTarget.getBoundingClientRect()
    const y = event.clientY - top
    setDropPos(
      y < height * 0.28 ? 'before' : y > height * 0.72 ? 'after' : 'inside',
    )
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const id = event.dataTransfer.getData('text/plain')
    if (id && dropPos) {
      setTree((prev) => moveN(prev, id, node.id, dropPos))
    }
    setDropPos(null)
  }

  const pct = total ? done / total : 0

  return (
    <>
      {dropPos === 'before' && (
        <div className="drop-line" style={{ marginLeft: paddingLeft + 16 }} />
      )}

      <div
        className={`node${dropPos === 'inside' ? ' drop-inside' : ''}`}
        style={{ paddingLeft }}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData('text/plain', node.id)
          event.dataTransfer.effectAllowed = 'move'
        }}
        onDragOver={onDragOver}
        onDragLeave={(event) => {
          const relatedTarget = event.relatedTarget as Node | null
          if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
            setDropPos(null)
          }
        }}
        onDrop={onDrop}
        onDragEnd={() => setDropPos(null)}
      >
        <button
          className={`expand-btn${hasKids && !node.collapsed ? ' open' : ''}`}
          style={{
            opacity: hasKids ? 1 : 0.15,
            cursor: hasKids ? 'pointer' : 'default',
          }}
          onClick={() =>
            hasKids &&
            setTree((prev) =>
              upd(prev, node.id, (target) => {
                target.collapsed = !target.collapsed
              }),
            )
          }
          tabIndex={hasKids ? 0 : -1}
        >
          <span className="arr">▶</span>
        </button>

        <button
          className={`check${allDone ? ' done' : someDone ? ' part' : ''}`}
          onClick={() => setTree((prev) => toggleTree(prev, node.id))}
          title={
            hasKids
              ? allDone
                ? 'Uncheck all'
                : 'Check all'
              : node.completed
                ? 'Uncheck'
                : 'Check'
          }
        >
          {allDone ? '✓' : someDone ? '-' : ''}
        </button>

        {isEditing ? (
          <input
            className="node-input"
            autoFocus
            value={node.text}
            onChange={(event) =>
              setTree((prev) =>
                upd(prev, node.id, (target) => {
                  target.text = event.target.value
                }),
              )
            }
            onKeyDown={onKey}
            onBlur={() => setEditingId(null)}
            placeholder="Task name..."
          />
        ) : (
          <span
            className={`node-text${allDone ? ' done' : ''}`}
            onClick={() => setEditingId(node.id)}
            title="Click to edit"
          >
            {node.text || <span className="ph">click to edit...</span>}
          </span>
        )}

        {hasKids && !isLeaf && (
          <div className="prog">
            <div className="prog-track">
              <div
                className="prog-fill"
                style={{
                  width: `${pct * 100}%`,
                  background: allDone
                    ? '#5a8f60'
                    : 'linear-gradient(90deg, #cf7d3c, #e8c547)',
                }}
              />
            </div>
            <span className="prog-label">
              {done}/{total}
            </span>
          </div>
        )}

        {hasKids && node.collapsed && (
          <span className="collapsed-count">{countDescendants(node)}</span>
        )}

        <span className="actions">
          <button
            className={`act${node.starred ? ' starred' : ''}`}
            title={node.starred ? 'Unpin from Focus' : 'Pin to Focus'}
            onClick={() =>
              setTree((prev) =>
                upd(prev, node.id, (target) => {
                  target.starred = !target.starred
                }),
              )
            }
          >
            ★
          </button>
          {hasKids && (
            <button
              className="act zoom"
              title="Zoom in"
              onClick={() =>
                setZoom((prev) => [...prev, { id: node.id, text: node.text }])
              }
            >
              +
            </button>
          )}
          <button
            className="act del"
            title="Delete"
            onClick={() => setTree((prev) => rem(prev, node.id))}
          >
            x
          </button>
        </span>
      </div>

      {dropPos === 'after' && (
        <div className="drop-line" style={{ marginLeft: paddingLeft + 16 }} />
      )}

      {hasKids && !node.collapsed && (
        <div>
          {node.children.map((child) => (
            <Node key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  )
}

function HarvestView() {
  const { tree, setTree } = useTodoCtx()
  const items = getAllStarred(tree)

  if (!items.length) {
    return (
      <div className="empty">
        <div style={{ fontSize: 44, opacity: 0.15 }}>★</div>
        <div>No pinned tasks yet</div>
        <div style={{ fontSize: 12, color: '#2e2c2a' }}>
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
        const { done, total } = getProgress(item)
        const allDone = total > 0 && done === total
        return (
          <div key={item.id} className="h-item">
            <button
              className={`check${allDone ? ' done' : ''}`}
              style={{ flexShrink: 0 }}
              onClick={() => setTree((prev) => toggleTree(prev, item.id))}
            >
              {allDone && '✓'}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: 14,
                  color: allDone ? '#333130' : '#e6dfd6',
                  textDecoration: allDone ? 'line-through' : 'none',
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

const INIT: TreeNode[] = [
  {
    id: 'w1',
    text: 'Work',
    completed: false,
    collapsed: false,
    starred: false,
    children: [
      {
        id: 'w2',
        text: 'Q2 Marketing Launch',
        completed: false,
        collapsed: false,
        starred: false,
        children: [
          {
            id: 'w3',
            text: 'Draft email campaign',
            completed: true,
            collapsed: false,
            starred: false,
            children: [],
          },
          {
            id: 'w4',
            text: 'Design landing page',
            completed: false,
            collapsed: false,
            starred: true,
            children: [],
          },
          {
            id: 'w5',
            text: 'Set up A/B testing',
            completed: false,
            collapsed: false,
            starred: false,
            children: [],
          },
          {
            id: 'w6',
            text: 'Schedule social posts',
            completed: false,
            collapsed: false,
            starred: false,
            children: [],
          },
        ],
      },
      {
        id: 'w7',
        text: 'Team sync prep',
        completed: false,
        collapsed: false,
        starred: false,
        children: [
          {
            id: 'w8',
            text: 'Compile weekly metrics',
            completed: true,
            collapsed: false,
            starred: false,
            children: [],
          },
          {
            id: 'w9',
            text: 'Update roadmap slides',
            completed: false,
            collapsed: false,
            starred: true,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'p1',
    text: 'Personal',
    completed: false,
    collapsed: false,
    starred: false,
    children: [
      {
        id: 'p2',
        text: 'Book dentist appointment',
        completed: false,
        collapsed: false,
        starred: true,
        children: [],
      },
      {
        id: 'p3',
        text: 'Renew gym membership',
        completed: false,
        collapsed: false,
        starred: false,
        children: [],
      },
      {
        id: 'p4',
        text: 'Weekend trip planning',
        completed: false,
        collapsed: false,
        starred: false,
        children: [
          {
            id: 'p5',
            text: 'Check hotel prices',
            completed: true,
            collapsed: false,
            starred: false,
            children: [],
          },
          {
            id: 'p6',
            text: 'Book train tickets',
            completed: false,
            collapsed: false,
            starred: false,
            children: [],
          },
          {
            id: 'p7',
            text: 'Pack bag',
            completed: false,
            collapsed: false,
            starred: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'i1',
    text: 'Ideas',
    completed: false,
    collapsed: false,
    starred: false,
    children: [
      {
        id: 'i2',
        text: 'Build a To-Do Tree app',
        completed: false,
        collapsed: false,
        starred: true,
        children: [],
      },
      {
        id: 'i3',
        text: 'Write a short story',
        completed: false,
        collapsed: false,
        starred: false,
        children: [],
      },
    ],
  },
]

function App() {
  const [tree, setTree] = useState<TreeNode[]>(INIT)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [zoom, setZoom] = useState<Breadcrumb[]>([])
  const [view, setView] = useState<'tree' | 'harvest'>('tree')

  const zoomedNode = zoom.length
    ? findNode(tree, zoom[zoom.length - 1].id)
    : null
  const displayNodes = zoomedNode ? zoomedNode.children : tree
  const starred = getAllStarred(tree)

  const addRoot = () => {
    const node = makeNode()
    if (zoomedNode) {
      setTree((prev) =>
        upd(prev, zoomedNode.id, (target) => {
          target.children.push(node)
          target.collapsed = false
        }),
      )
    } else {
      setTree((prev) => [...prev, node])
    }
    setEditingId(node.id)
  }

  const ctx: CtxValue = {
    tree,
    setTree,
    editingId,
    setEditingId,
    zoom,
    setZoom,
  }

  return (
    <Ctx.Provider value={ctx}>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="brand">
            <span className="brand-icon">⬡</span>
            <div>
              <div className="brand-name">TodoTree</div>
              <div className="brand-sub">
                Infinite hierarchy · Focused execution
              </div>
            </div>
          </div>
          <div className="tabs">
            <button
              className={`tab${view === 'tree' ? ' active' : ''}`}
              onClick={() => setView('tree')}
            >
              Tree
            </button>
            <button
              className={`tab${view === 'harvest' ? ' active' : ''}`}
              onClick={() => setView('harvest')}
            >
              Focus{' '}
              {starred.length > 0 && (
                <span className="badge">{starred.length}</span>
              )}
            </button>
          </div>
        </header>

        {view === 'tree' && zoom.length > 0 && (
          <nav className="breadcrumbs">
            <button className="crumb" onClick={() => setZoom([])}>
              Root
            </button>
            {zoom.map((crumb, index) => (
              <span
                key={crumb.id}
                style={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <span className="sep">›</span>
                <button
                  className={`crumb${index === zoom.length - 1 ? ' cur' : ''}`}
                  onClick={() => setZoom((prev) => prev.slice(0, index + 1))}
                >
                  {crumb.text || 'Untitled'}
                </button>
              </span>
            ))}
          </nav>
        )}

        <main className="main">
          {view === 'tree' ? (
            displayNodes.length ? (
              displayNodes.map((node) => (
                <Node key={node.id} node={node} depth={0} />
              ))
            ) : (
              <div className="empty">
                <div style={{ fontSize: 48, opacity: 0.12 }}>⬡</div>
                <div>Nothing here yet</div>
                <button className="btn-start" onClick={addRoot}>
                  + Add first task
                </button>
              </div>
            )
          ) : (
            <HarvestView />
          )}
        </main>

        {view === 'tree' && (
          <>
            <footer className="footer">
              <button className="btn-add-root" onClick={addRoot}>
                + Add task
              </button>
            </footer>
            <div className="shortcuts">
              <div className="shortcut">
                <span className="key">Enter</span> new sibling
              </div>
              <div className="shortcut">
                <span className="key">Tab</span> indent
              </div>
              <div className="shortcut">
                <span className="key">Shift+Tab</span> outdent
              </div>
              <div className="shortcut">
                <span className="key">Backspace</span> delete empty
              </div>
              <div className="shortcut">
                <span className="key">+</span> zoom in
              </div>
              <div className="shortcut">
                <span className="key">*</span> pin to focus
              </div>
            </div>
          </>
        )}
      </div>
    </Ctx.Provider>
  )
}
