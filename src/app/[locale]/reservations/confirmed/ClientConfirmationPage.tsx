'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/app/[locale]/lib/firebase'
import { SerializedSession } from '@/app/[locale]/lib/stripe/types'
import { Calendar, Ticket, Type, DollarSign } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ReservationDetails } from '../../interfaces/interfaces'
import { QRCodePDFGenerator } from '../../components/QRCodePDFGenerator'

interface ClientConfirmationPageProps {
  reservationId?: string | null
  scheduleId?: string | null
  session?: SerializedSession | null
  error?: boolean
}

export function ClientConfirmationPage({
  reservationId: initialReservationId,
  scheduleId,
  session,
  error: initialError,
}: ClientConfirmationPageProps) {
  const t = useTranslations('ClientConfirmationPage')

  const [reservationId, setReservationId] = useState<string | null>(initialReservationId || null)
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState(initialError || false)

  useEffect(() => {
    const createReservation = async () => {
      if (reservationId || !scheduleId || !session) return

      try {
        // Recuperar los datos del localStorage
        const storedData = localStorage.getItem(`reservation_${scheduleId}`)
        if (!storedData) {
          throw new Error('No se encontraron los datos de la reserva')
        }

        const reservationData = JSON.parse(storedData)

        // Crear la reservación en Firestore
        const finalReservationData = {
          visitTypeId: reservationData.visitTypeId,
          userId: reservationData.userId,
          scheduleId: reservationData.scheduleId,
          numPeople: reservationData.numPeople,
          attendees: reservationData.formData.attendees,
          paymentStatus: 'completed',
          paymentId: session.payment_intent != null ? session.payment_intent : null,
          createdAt: new Date(),
          totalAmount: session.amount_total,
          currency: session.currency,
          stripeSessionId: session.id,
        }

        // Agregar la reservación a Firestore
        const reservationRef = await addDoc(collection(db, 'reservations'), finalReservationData)

        // Actualizar los cupos disponibles
        const scheduleRef = doc(db, 'schedules', scheduleId)
        await updateDoc(scheduleRef, {
          availableSlots: increment(-reservationData.numPeople),
        })

        // Limpiar localStorage y actualizar estado
        localStorage.removeItem(`reservation_${scheduleId}`)
        setReservationId(reservationRef.id)
      } catch (error) {
        console.error('Error creating reservation:', error)
        setError(true)
      }
    }

    createReservation()
  }, [reservationId, scheduleId, session])

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!reservationId) return

      try {
        const reservationRef = doc(db, 'reservations', reservationId)
        const reservationSnap = await getDoc(reservationRef)

        if (reservationSnap.exists()) {
          setReservationDetails(reservationSnap.data())
        } else {
          console.error('No reservation found')
        }
      } catch (error) {
        console.error('Error fetching reservation details:', error)
      }
    }

    fetchReservationDetails()
  }, [reservationId])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto  ">
        <div className="bg-green-50 p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">{t('Title')}</h1>

          <div className="bg-white rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <Type className="w-6 h-6 text-green-600" />
                <div>
                  {/*FIXING PENDING */}
                  <p className="text-sm text-green-600 font-medium">{t('ReservationType')}</p>
                  <p className="text-lg text-gray-800">
                    {reservationDetails?.visitTypeId || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <Ticket className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">{t('TicketNumber')}</p>
                  <p className="text-lg text-gray-800">{reservationDetails?.numPeople || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">{t('Date')}</p>
                  <p className="text-lg text-gray-800">
                    {reservationDetails?.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">{t('TotalPrice')}</p>
                  <p className="text-lg text-gray-800">
                    {reservationDetails?.totalAmount
                      ? reservationDetails.totalAmount / 100
                      : '0.00'}{' '}
                    {reservationDetails?.currency?.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8 text-center">
            {t('Description')}
            {error && ' Tuttavia, si è verificato un errore nel salvataggio di alcuni dettagli.'}
          </p>
          {/* {reservationId && (
            <p className="text-md text-gray-600 mb-4">
              {t('ReservationNumber')} {reservationId}
            </p>
          )} */}

          <div className="flex flex-col md:flex-row justify-center items-center md:gap-2 gap-4">
            <QRCodePDFGenerator
              reservationId={reservationId}
              reservationDetails={reservationDetails}
            />
            <div className="space-y-4 text-center inline-flex w-full">
              <Link
                href="/"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full min-w-[168px]"
              >
                {t('ReturnHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
