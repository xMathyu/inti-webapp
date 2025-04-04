'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { getFirestore, doc, getDoc, Timestamp } from 'firebase/firestore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import CustomLoader from '@/components/CustomLoader'
import { CalendarDays, Users, CreditCard, Clock, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { QRCodePDFGenerator } from '../../components/QRCodePDFGenerator'

interface ReservationDetails {
  id: string
  attendees: {
    firstName: string
    lastName: string
    documentType: string
    documentNumber: string
    birthDate: string
    email: string
    phone: string
  }[]
  createdAt: Timestamp
  currency: string
  numPeople: number
  paymentStatus: string
  scheduleId: string
  totalAmount: number
  visitTypeId: string
  scheduleDetails?: {
    date: string
    startTime: string
    endTime: string
    location?: string
  }
}

export default function ReservationDetails() {
  const t = useTranslations('MyReservations')
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const db = getFirestore()
        const reservationRef = doc(db, 'reservations', params.id as string)
        const reservationSnap = await getDoc(reservationRef)

        if (reservationSnap.exists()) {
          const data = reservationSnap.data() as ReservationDetails

          // Obtener detalles del horario
          const scheduleRef = doc(db, 'schedules', data.scheduleId)
          const scheduleSnap = await getDoc(scheduleRef)

          if (scheduleSnap.exists()) {
            const scheduleData = scheduleSnap.data()
            data.scheduleDetails = {
              date: scheduleData.date,
              startTime: scheduleData.startTime,
              endTime: scheduleData.endTime,
              location: scheduleData.location,
            }
          }

          setReservation({ ...data, id: reservationSnap.id })
        } else {
          setError(t('ReservationNotFound'))
        }
      } catch (err) {
        console.error('Error fetching reservation:', err)
        setError(t('ErrorFetchingReservation'))
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchReservationDetails()
    }
  }, [params.id, t])

  if (loading) return <CustomLoader />
  if (error) return <div className="text-center text-red-600">{error}</div>
  if (!reservation) return <div className="text-center">{t('ReservationNotFound')}</div>

  const formatFirestoreDate = (date: Timestamp | string | undefined) => {
    if (!date) return 'N/A'
    // Si es un timestamp de Firestore
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP')
    }
    // Si es una fecha válida
    try {
      return format(new Date(date), 'PPP')
    } catch {
      return 'N/A'
    }
  }

  const formatFirestoreTime = (date: Timestamp | undefined) => {
    if (!date) return 'N/A'
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'h:mm a')
    }
    return 'N/A'
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-6 py-3 h-auto flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('Back')}
        </Button>
        <h1 className="text-2xl font-bold">{t('ReservationDetails')}</h1>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Encabezado */}
          <div className="border-b bg-gray-50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <h2 className="text-xl font-semibold">{reservation.visitTypeId}</h2>
                <span
                  className={`inline-block  px-3 py-1 rounded-full text-sm font-semibold ${
                    reservation.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : reservation.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {t(`Status.${reservation.paymentStatus}`)}
                </span>
              </div>
              <QRCodePDFGenerator
                reservationId={params.id as string}
                reservationDetails={reservation}
              />
            </div>
          </div>

          <div className="p-6">
            {/* Detalles principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('Date')}</p>
                    <p className="font-medium">
                      {reservation.scheduleDetails?.date ||
                        formatFirestoreDate(reservation.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('Time')}</p>
                    <p className="font-medium">{formatFirestoreTime(reservation.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('People')}</p>
                    <p className="font-medium">{reservation.numPeople}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('Total')}</p>
                    <p className="font-medium">
                      {formatPrice(reservation.totalAmount, reservation.currency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Detalles de los participantes */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('Participants')}</h2>
              <div className="space-y-4">
                {reservation.attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium mb-2">
                      {t('Participant')} {index + 1}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('Name')}</p>
                        <p className="font-medium">{`${attendee.firstName} ${attendee.lastName}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('Document')}</p>
                        <p className="font-medium">{`${attendee.documentType}: ${attendee.documentNumber}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('Email')}</p>
                        <p className="font-medium">{attendee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('Phone')}</p>
                        <p className="font-medium">{attendee.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
