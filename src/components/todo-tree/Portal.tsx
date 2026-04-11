import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export function Portal({
  children,
  open = true,
}: {
  children: ReactNode
  open?: boolean
}) {
  if (!open) return null
  return createPortal(children, document.body)
}
