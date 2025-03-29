'use client'

import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/app/[locale]/lib/firebase'

import { useTranslations } from 'next-intl'

export default function AdminPanel() {
  const t = useTranslations('Admin')

  const [visitType, setVisitType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const scheduleDocId = `${visitType}_${date}_${time}`
      const scheduleRef = doc(db, 'schedules', scheduleDocId)
      await setDoc(scheduleRef, { availableSlots }, { merge: true })
      setMessage(t('Message'))
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t('Error'))
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-green-50 rounded shadow">
      <h1 className="text-xl font-bold text-green-800 mb-4">{t('Title')}</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <Label htmlFor="visitType" className="block text-green-800">
            {t('VisitType')}
          </Label>
          <Input
            id="visitType"
            type="text"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            placeholder={t('VisitType_PH')}
            required
          />
        </div>
        <div>
          <Label htmlFor="date" className="block text-green-800">
            {t('Date')}
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time" className="block text-green-800">
            {t('Time')}
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="availableSlots" className="block text-green-800">
            {t('QuoteAvailable')}
          </Label>
          <Input
            id="availableSlots"
            type="number"
            value={availableSlots}
            onChange={(e) => setAvailableSlots(parseInt(e.target.value))}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
          {t('Update')}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}
    </div>
  )
}
