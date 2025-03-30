import GrillaCard from '@/components/ui/grilla-card'
import { useTranslations } from 'next-intl'
export default function VisitsPage() {
  const t = useTranslations('AllVisits')
  return (
    <div className="container mx-auto py-10">
      {/* 🔹 Separate title */}
      <h1 className="text-4xl font-bold text-center text-green-800 mb-8">{t('Title')}</h1>

      {/* 🔹 The card grid */}
      <GrillaCard />
    </div>
  )
}
