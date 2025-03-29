'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { doc, collection, addDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/app/[locale]/lib/firebase'
import { SerializedSession } from '@/app/[locale]/lib/stripe/types'

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
  const [reservationId, setReservationId] = useState<string | null>(initialReservationId || null)
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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Prenotazione Confermata!</h1>
          <p className="text-lg text-gray-700 mb-8">
            Grazie per la tua prenotazione. Abbiamo inviato una email di conferma con tutti i
            dettagli.
            {error && ' Tuttavia, si è verificato un errore nel salvataggio di alcuni dettagli.'}
          </p>
          {reservationId && (
            <p className="text-md text-gray-600 mb-4">Numero di prenotazione: {reservationId}</p>
          )}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
