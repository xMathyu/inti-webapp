'use client'

import { ReactNode, useEffect } from 'react'
import { useCheckAdmin } from '../hooks/useCheckAdmin'
import { useRouter } from 'next/navigation'
import CustomLoader from '@/components/CustomLoader'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { loading, role } = useCheckAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!loading && role !== 'admin') {
      router.push('/')
    }
  }, [loading, role, router])

  if (loading || role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <CustomLoader message="Verifica delle autorizzazioni..." />
      </div>
    )
  }

  return <>{children}</>
}
