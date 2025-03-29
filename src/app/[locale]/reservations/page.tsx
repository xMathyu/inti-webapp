'use client'

import React, { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { toast } from 'sonner'
import { db } from '@/app/[locale]/lib/firebase'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import FormsReservation from '../components/FormsReservation'
import AvailableSchedules from '../components/AvailableSchedules'
import { Schedule, VisitTypeOption } from '../interfaces/interfaces'
import { useTranslations } from 'next-intl'

const ReservationsPage = () => {
  const t = useTranslations('Rates')
  const router = useRouter()
  const searchParams = useSearchParams()
  const methods = useForm()

  const [visitType, setVisitType] = useState('')
  const [date, setDate] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [visitId, setVisitId] = useState('')

  const [visitTypesOptions, setVisitTypesOptions] = useState<VisitTypeOption[]>([])
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchVisitTypes = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'visitTypes'))
      const options: VisitTypeOption[] = []
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data()
        options.push({ id: docSnap.id, name: data.name })
      })
      setVisitTypesOptions(options)
    } catch (err) {
      console.error('Errore durante il caricamento dei tipi di visita:', err)
    }
  }, [])

  useEffect(() => {
    fetchVisitTypes()
  }, [fetchVisitTypes])

  useEffect(() => {
    const preselectedType = searchParams.get('type')
    if (preselectedType) {
      setVisitType(preselectedType)
      setVisitId(preselectedType)
    }
  }, [searchParams])

  const searchSchedules = useCallback(
    async (requireAllFields = true) => {
      setError('')
      setAvailableSchedules([])

      if (requireAllFields && (!visitType || !date || numPeople < 1)) {
        setError(t('Form.UncompleteFields'))
        return
      }

      setLoading(true)

      try {
        const schedulesRef = collection(db, 'schedules')
        const q = query(
          schedulesRef,
          where('visitType', '==', visitType),
          ...(date ? [where('date', '==', date)] : []),
        )
        const querySnapshot = await getDocs(q)
        const schedules: Schedule[] = []

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<Schedule, 'id'>
          if (data.active && data.availableSlots >= numPeople) {
            if (data.mode === 'bulk') {
              schedules.push({
                id: docSnap.id,
                visitType: data.visitType,
                mode: 'individual',
                date: data.date,
                time: data.startTime,
                availableSlots: data.availableSlots,
                active: data.active,
              })
            } else {
              schedules.push({ id: docSnap.id, ...data })
            }
          }
        })

        if (schedules.length === 0) {
          toast.error(t('ToastMessages.ScheduleError'))
        } else {
          setAvailableSchedules(schedules)
          toast.success(t('ToastMessages.ScheduleSuccess'))
        }
      } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
          toast.error(err.message || t('ToastMessages.LoadingError'))
        } else {
          toast.error(t('ToastMessages.LoadingError'))
        }
      }
      setLoading(false)
    },
    [visitType, date, numPeople, t],
  )

  useEffect(() => {
    if (visitType) {
      searchSchedules(false)
    }
  }, [visitType, searchSchedules])

  useEffect(() => {
    if (date) {
      searchSchedules(false)
    }
  }, [date, searchSchedules])

  const handleSearch: SubmitHandler<{
    visitType: string
    date: string
    numPeople: number
  }> = async () => {
    await searchSchedules()
  }

  const handleSelectSchedule = (schedule: Schedule) => {
    if (!schedule.id || !numPeople) {
      toast.error(t('ToastMessages.SelectError'))
      return
    }

    router.push(
      `/reservations/confirm?scheduleId=${encodeURIComponent(schedule.id)}&numPeople=${numPeople}`,
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-full mx-auto p-4 bg-green-50 rounded shadow">
        <h1 className="text-xl font-bold text-green-800 mb-4">{t('Form.Title')}</h1>

        <FormsReservation
          visitType={visitType}
          setVisitType={setVisitType}
          date={date}
          setDate={setDate}
          numPeople={numPeople}
          setNumPeople={setNumPeople}
          visitTypesOptions={visitTypesOptions}
          loading={loading}
          handleSearch={handleSearch}
          visitId={visitId}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {availableSchedules.length > 0 && (
        <div className="max-w-full mx-auto p-4 bg-green-50 rounded shadow">
          <AvailableSchedules
            schedules={availableSchedules}
            handleSelectSchedule={handleSelectSchedule}
          />
        </div>
      )}
    </FormProvider>
  )
}

const ReservationsPageWrapper = () => {
  const t = useTranslations('Rates')
  return (
    <Suspense fallback={<div>{t('Form.Loading')}</div>}>
      <ReservationsPage />
    </Suspense>
  )
}

export default ReservationsPageWrapper
