import { type ReactNode, useEffect, useMemo } from 'react'
import { X, User, LogIn, LogOut, Star, Clock, CalendarClock } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../auth/auth-context'
import {
  getProgress,
  getAllStarred,
  getHarvestSections,
} from '../todo-tree/tree-utils'
import type { TreeNode } from '../todo-tree/types'

interface MainMenuProps {
  open: boolean
  onClose: () => void
  children?: ReactNode
  nodes: TreeNode[]
}

export function MainMenu({ open, onClose, children, nodes }: MainMenuProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Lock body scroll when full-screen on mobile
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    if (open && !mq.matches) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Stats derived from tree
  const stats = useMemo(() => {
    const syntheticRoot: TreeNode = {
      id: '__root__',
      text: '',
      completed: false,
      collapsed: false,
      starred: false,
      children: nodes,
    }
    const { done, total } = getProgress(syntheticRoot)
    const starred = getAllStarred(nodes).length
    const sections = getHarvestSections(nodes)
    const today = sections.find((s) => s.priority === 'today')?.items.length ?? 0
    const soon = sections.find((s) => s.priority === 'soon')?.items.length ?? 0
    return { done, total, starred, today, soon }
  }, [nodes])

  return (
    <>
      {/* Overlay — desktop sidebar only */}
      <div
        className="main-menu-overlay"
        data-open={open}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Menu panel */}
      <aside
        className="main-menu-panel"
        data-open={open}
        aria-label="Main menu"
      >
        <div className="main-menu-head">
          <button
            className="focus-close-btn"
            onClick={onClose}
            aria-label="Close menu"
            title="Close"
          >
            <X className="icon-sm" aria-hidden="true" />
          </button>
        </div>

        <div className="main-menu-body">

          {/* Account */}
          <section className="main-menu-section">
            <div className="main-menu-section-title">Account</div>
            {isAuthenticated && user ? (
              <div className="menu-account-row">
                <div className="menu-account-avatar" aria-hidden="true">
                  {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <div className="menu-account-info">
                  {user.username && <div className="menu-account-name">{user.username}</div>}
                  <div className="menu-account-email">{user.email}</div>
                </div>
                <button
                  className="menu-account-logout focus-close-btn"
                  onClick={() => {
                    logout()
                    void navigate({ to: '/auth' })
                  }}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="icon-sm" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="menu-account-row menu-account-row--guest">
                <div className="menu-account-avatar menu-account-avatar--guest" aria-hidden="true">
                  <User className="icon-sm" aria-hidden="true" />
                </div>
                <div className="menu-account-info">
                  <div className="menu-account-name">Guest</div>
                  <div className="menu-account-email">Edits saved on this device</div>
                </div>
                <a
                  className="focus-close-btn"
                  href="/auth"
                  title="Sign in"
                  aria-label="Sign in"
                >
                  <LogIn className="icon-sm" aria-hidden="true" />
                </a>
              </div>
            )}
          </section>

          {/* Quick stats */}
          {stats.total > 0 && (
            <section className="main-menu-section">
              <div className="main-menu-section-title">Quick stats</div>
              <div className="menu-stat-grid">
                <div className="menu-stat-chip">
                  <span className="menu-stat-value">{stats.done}/{stats.total}</span>
                  <span className="menu-stat-label">Done</span>
                </div>
                <div className="menu-stat-chip">
                  <span className="menu-stat-value menu-stat-value--today">
                    <Clock className="icon-xs" aria-hidden="true" />
                    {stats.today}
                  </span>
                  <span className="menu-stat-label">Today</span>
                </div>
                <div className="menu-stat-chip">
                  <span className="menu-stat-value menu-stat-value--soon">
                    <CalendarClock className="icon-xs" aria-hidden="true" />
                    {stats.soon}
                  </span>
                  <span className="menu-stat-label">Soon</span>
                </div>
                <div className="menu-stat-chip">
                  <span className="menu-stat-value menu-stat-value--starred">
                    <Star className="icon-xs" aria-hidden="true" />
                    {stats.starred}
                  </span>
                  <span className="menu-stat-label">Starred</span>
                </div>
              </div>
            </section>
          )}

          {/* Help */}
          <section className="main-menu-section">
            <div className="main-menu-section-title">Shortcuts</div>
            <div className="shortcuts">
              <div className="shortcut"><span className="key">Enter</span> new sibling</div>
              <div className="shortcut"><span className="key">Tab</span> indent</div>
              <div className="shortcut"><span className="key">Shift+Tab</span> outdent</div>
              <div className="shortcut"><span className="key">Backspace</span> delete empty</div>
              <div className="shortcut"><span className="key">+</span> zoom in</div>
              <div className="shortcut"><span className="key">*</span> pin to harvest</div>
              <div className="shortcut"><span className="key">☑</span> toggle category</div>
            </div>
          </section>

          {children}
        </div>
      </aside>
    </>
  )
}
