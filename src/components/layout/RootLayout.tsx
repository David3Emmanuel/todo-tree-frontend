import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { AuthProvider } from '../auth/auth-context'
import { MainMenu } from './MainMenu'

export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <AuthProvider>
      <Outlet />
      <MainMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </AuthProvider>
  )
}
