'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/app/[locale]/lib/firebase'
import { useRouter } from 'next/navigation'

export function useCheckAdmin() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            const userRole = userData.role

            setRole(userRole)

            if (userRole !== 'admin') {
              router.push('/')
            }
          } else {
            router.push('/')
          }
        } catch (error) {
          console.error('Error obtaining user data:', error)
          router.push('/')
        }
      } else {
        router.push('/')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  return { role, loading }
}
