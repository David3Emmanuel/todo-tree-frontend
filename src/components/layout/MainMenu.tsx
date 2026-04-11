import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface MainMenuProps {
  open: boolean
  onClose: () => void
  children?: ReactNode
}

export function MainMenu({ open, onClose, children }: MainMenuProps) {
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

  return (
    <>
      {/* Overlay — desktop sidebar only (click outside to close) */}
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
        {children}
      </aside>
    </>
  )
}
