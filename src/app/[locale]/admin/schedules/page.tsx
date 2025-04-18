'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import ScheduleForm, { ScheduleFormData } from '@/app/[locale]/components/admin/ScheduleForm'
import { toast } from 'sonner'
import { addDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from '@/app/[locale]/shared/DateRangePicker'
import { db } from '@/app/[locale]/lib/firebase'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Schedule, VisitTypeOption } from '@/app/[locale]/interfaces/interfaces'
import ScheduleCard from '@/app/[locale]/components/admin/ScheduleCard'

import { useTranslations } from 'next-intl'

export default function AdminSchedulesPanel() {
  const t = useTranslations('Admin/Schedules')

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7))
  const [selectedType, setSelectedType] = useState<string>('')

  const [visitTypesOptions, setVisitTypesOptions] = useState<VisitTypeOption[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [filterByDate, setFilterByDate] = useState(true)

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

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'schedules'))
      const data: Schedule[] = []
      querySnapshot.forEach((docSnap) => {
        data.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Schedule, 'id'>),
        })
      })
      setSchedules(data)
    } catch {
      toast.error(t('ToastMessages.UploadError'))
    }
    setLoading(false)
  }, [t])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const handleSave = async (data: ScheduleFormData) => {
    try {
      if (data.mode === 'individual') {
        const docId = selectedSchedule
          ? selectedSchedule.id
          : `${data.visitType}_${data.date}_${data.time}`
        await setDoc(doc(db, 'schedules', docId), { ...data }, { merge: true })
        toast.success(t('ToastMessages.TimeTable'))
        setModalOpen(false)
        setSchedules((prev) => {
          const newItem = { id: docId, ...data } as Schedule
          if (selectedSchedule) {
            return prev.map((item) => (item.id === selectedSchedule.id ? newItem : item))
          } else {
            return [newItem, ...prev]
          }
        })
      } else {
        // Bulk mode: Generar un horario por cada día del rango
        const start = new Date(data.startDate!)
        const end = new Date(data.endDate!)
        if (start > end) {
          throw new Error('La data di inizio deve essere precedente alla data di fine.')
        }
        const dates: string[] = []
        const current = new Date(start)
        while (current <= end) {
          dates.push(current.toLocaleDateString('it-IT', { timeZone: 'UTC' }))
          current.setDate(current.getDate() + 1)
        }
        for (const dateStr of dates) {
          const docId = `${data.visitType}_${dateStr}_${data.startTime}-${data.endTime}`
          await setDoc(
            doc(db, 'schedules', docId),
            {
              visitType: data.visitType,
              mode: 'bulk',
              date: dateStr,
              startTime: data.startTime,
              endTime: data.endTime,
              availableSlots: data.availableSlots,
              active: data.active,
            },
            { merge: true },
          )
        }
        toast.success(t('ToastMessages.CreationSuccess'))
        setModalOpen(false)
        fetchSchedules()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || t('ToastMessages.Error'))
      } else {
        toast.error(t('ToastMessages.UnexpectedError'))
      }
    }
  }

  const handleDelete = async (schedule: Schedule) => {
    try {
      await deleteDoc(doc(db, 'schedules', schedule.id))
      toast.success(t('ToastMessages.DeleteSuccess'))
      setSchedules((prev) => prev.filter((item) => item.id !== schedule.id))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('ToastMessages.UnexpectedError')
      toast.error(errorMessage)
    }
  }

  const handleToggleActive = async (schedule: Schedule) => {
    try {
      const newStatus = !schedule.active
      await setDoc(doc(db, 'schedules', schedule.id), { active: newStatus }, { merge: true })
      setSchedules((prev) =>
        prev.map((item) => (item.id === schedule.id ? { ...item, active: newStatus } : item)),
      )
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('ToastMessages.UnexpectedError')
      toast.error(errorMessage)
    }
  }

  const openModalForNew = () => {
    setSelectedSchedule(null)
    setModalOpen(true)
  }

  const openModalForEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setModalOpen(true)
  }

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) setStartDate(range.from)
    if (range?.to) setEndDate(range.to)
  }

  const handleFilterChange = (checked: boolean) => {
    setFilterByDate(checked)
    if (checked) {
      setSelectedType('')
    } else {
      setStartDate(new Date())
      setEndDate(addDays(new Date(), 7))
    }
  }

  const filteredSchedules = schedules.filter((schedule) => {
    const scheduleDate = schedule.date ? new Date(schedule.date) : new Date()
    const matchesDateRange = filterByDate && scheduleDate >= startDate && scheduleDate <= endDate
    const matchesType = !filterByDate && selectedType ? schedule.visitType === selectedType : false

    const isValidVisitType = visitTypesOptions.some(
      (option) => option.name.trim().toLowerCase() === schedule.visitType.trim().toLowerCase(),
    )

    return (matchesDateRange || matchesType) && isValidVisitType
  })

  const sortedSchedules = filteredSchedules.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
  )

  const paginatedSchedules = sortedSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const totalPages = Math.ceil(sortedSchedules.length / itemsPerPage)

  return (
    <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">{t('Title')}</h1>
        <Button
          onClick={openModalForNew}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus size={20} />
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-green-800 font-bold mb-2">{t('Subtitle')}</label>
        <div className="flex gap-4 items-center">
          <Switch
            id="filter-switch"
            checked={filterByDate}
            onCheckedChange={handleFilterChange}
            className={filterByDate ? 'bg-[#2563EF]' : 'bg-gray-200'}
          />
          <span>{filterByDate ? t('ByDate') : t('ByVisit')}</span>
        </div>
        <div className="flex gap-4 mt-4">
          {filterByDate ? (
            <DatePickerWithRange onDateChange={handleDateChange} />
          ) : (
            <div className="max-w-xs">
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                <SelectTrigger className="w-full bg-white border">
                  <SelectValue placeholder={t('Form.VisitSelect')}>
                    {selectedType || t('Form.VisitSelect')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {visitTypesOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <ScheduleForm
        initialData={
          selectedSchedule
            ? {
                mode: selectedSchedule.mode,
                visitType: selectedSchedule.visitType,
                date: selectedSchedule.date,
                time: selectedSchedule.time,
                startTime: selectedSchedule.startTime,
                endTime: selectedSchedule.endTime,
                availableSlots: selectedSchedule.availableSlots,
                active: selectedSchedule.active,
              }
            : undefined
        }
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />

      <hr className="my-4" />

      {loading ? (
        <p>{t('Loading')}</p>
      ) : paginatedSchedules.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onEdit={openModalForEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  ></PaginationPrevious>
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink href="#" onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  ></PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <p>{filterByDate ? t('NoReservationMade') : t('NoReservationType')}</p>
      )}
    </div>
  )
}
