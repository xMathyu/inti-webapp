'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/app/[locale]/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { BulkScheduleFormData } from '@/app/[locale]/interfaces/interfaces'
import { useTranslations } from 'next-intl'

interface BulkScheduleFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: BulkScheduleFormData) => Promise<void>
}

interface VisitTypeOption {
  id: string
  name: string
}

export default function BulkScheduleForm({ isOpen, onOpenChange, onSave }: BulkScheduleFormProps) {
  const t = useTranslations('Admin/Component')
  // Form fields
  const [visitType, setVisitType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState('')
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  // Options for the "Visit Type" dropdown
  const [visitTypesOptions, setVisitTypesOptions] = useState<VisitTypeOption[]>([])

  useEffect(() => {
    // Firestore query to fetch visit types
    const fetchVisitTypesOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'visitTypes'))
        const options: VisitTypeOption[] = []
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data()
          options.push({
            id: docSnap.id,
            name: data.name,
          })
        })
        setVisitTypesOptions(options)
      } catch (error) {
        console.error('Error al cargar los tipos de visita:', error)
      }
    }
    fetchVisitTypesOptions()
  }, [])

  // Reset fields when opening the modal in "Add" mode
  useEffect(() => {
    if (isOpen) {
      setVisitType('')
      setStartDate('')
      setEndDate('')
      setStartTime('')
      setEndTime('')
      setAvailableSlots('')
      setActive(true)
      setLocalError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    setLoading(true)
    const slots = parseInt(availableSlots)
    if (isNaN(slots)) {
      setLocalError(t('InvalidQuotaNumber'))
      setLoading(false)
      return
    }
    if (!visitType || !startDate || !endDate || !startTime || !endTime) {
      setLocalError(t('UncompletedFields'))
      setLoading(false)
      return
    }
    const formData: BulkScheduleFormData = {
      visitType,
      startDate,
      endDate,
      startTime,
      endTime,
      availableSlots: slots,
      active,
    }
    try {
      await onSave(formData)
      onOpenChange(false)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message || t('SaveError'))
      } else {
        setLocalError(t('SaveError'))
      }
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('AddBlockShedule')}</DialogTitle>
          <DialogDescription>{t('SelectVisit_Date_Quota')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="visitType" className="block text-green-800">
              {t('VisitType')}
            </Label>
            <select
              id="visitType"
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="border rounded p-2 w-full"
              required
            >
              <option value=""> {t('VIsitTypeSelect')}</option>
              {visitTypesOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="startDate" className="block text-green-800">
              {t('StartDate')}
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="block text-green-800">
              {t('EndDate')}
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="block text-green-800">
                {t('StartTime')}
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="block text-green-800">
                {t('EndTime')}
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="availableSlots" className="block text-green-800">
              {t('AvailableQuotas')}
            </Label>
            <Input
              id="availableSlots"
              type="number"
              value={availableSlots}
              onChange={(e) => setAvailableSlots(e.target.value)}
              placeholder="Ej: 30"
              required
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="active" className="text-green-800 mr-2">
              {t('Active')}
            </Label>
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
          {localError && <p className="text-red-500">{localError}</p>}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? t('Creating') : t('CreateSchedule')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
