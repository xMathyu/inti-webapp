'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toaster } from 'sonner'

interface Props {
  children: React.ReactNode
}

const hiddenNavbarRoutes = ['/reservations'] // ajusta según tus rutas internas sin locale

export function AppShell({ children }: Props) {
  const pathname = usePathname()

  // Detectar locale al inicio de la ruta
  const segments = pathname.split('/')
  const normalizedPath = '/' + segments.slice(2).join('/')

  const hideNavbar = hiddenNavbarRoutes.some((route) => normalizedPath.startsWith(route))

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <ScrollToTop />
      <Toaster position="bottom-right" />
    </>
  )
}
