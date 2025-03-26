'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/app/[locale]/lib/firebase'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { UserMenu } from './UserMenu'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useParams } from 'next/navigation'

export function Navbar() {
  const t = useTranslations('LandingPage.Section.Navbar')
  const params = useParams()
  const locale = params.locale as string

  const navLinks: { href: string; label: string }[] = t.raw('NavItems') as {
    href: string
    label: string
  }[]

  // Add locale to each link
  const localizedNavLinks = navLinks.map((link) => ({
    ...link,
    href: `/${locale}${link.href}`,
  }))

  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Authentication and user role check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin')
      } else {
        setIsAdmin(false)
      }
    })
    return unsubscribe
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error al cerrar sesión', error)
    }
  }

  // For mobile, the traditional function is used
  const renderMobileNavLinks = (className = '') =>
    localizedNavLinks.map(({ href, label }) => (
      <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={className}>
        {label}
      </Link>
    ))

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="h-16 shadow-md bg-gradient-to-r from-green-700 to-green-600 relative"
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between pr-4 pl-0 md:pr-2 md:pl-0 ">
        {/* Logo */}
        <Link href={`/${locale}/#hero`} className="h-full flex items-center">
          <div className="relative h-full w-32">
            <Image
              className="p-1"
              src="/logos/logos_pequeno.svg"
              alt="Logo Parco dei Colori"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>
        {/* Desktop Menu using NavigationMenu */}
        <div className="hidden md:flex items-center text-white space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-2">
              {localizedNavLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className="hover:bg-green-500/20 px-2 md:text-base md:px-0 lg:px-2 py-1 rounded"
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {user ? (
            <UserMenu
              userDisplayName={user.displayName || ''}
              isAdmin={isAdmin}
              handleSignOut={handleSignOut}
            />
          ) : (
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-green-500/20 p-4   "
            >
              <Link href={`/${locale}/auth`}>{t('AccessLogin')}</Link>
            </Button>
          )}
        </div>
        <LanguageSwitcher /> {/* Language switcher */}
        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 z-50"
        >
          {renderMobileNavLinks('text-green-700 hover:bg-green-50 w-full text-center py-2')}
          {user ? (
            <UserMenu
              mobile
              userDisplayName={user.displayName || ''}
              isAdmin={isAdmin}
              handleSignOut={handleSignOut}
            />
          ) : (
            <Link
              href={`/${locale}/auth`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-green-700 hover:bg-green-50 w-full text-center py-2"
            >
              {t('AccessLogin')}
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  )
}
