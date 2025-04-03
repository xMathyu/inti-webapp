'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/app/[locale]/lib/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import CustomLoader from '@/components/CustomLoader'
import { CalendarDays, Users, CreditCard, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Attendee {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  email: string
  phone: string
}

interface Reservation {
  id: string
  attendees: Attendee[]
  createdAt: string
  currency: string
  numPeople: number
  paymentStatus: string
  scheduleId: string
  totalAmount: number
  visitTypeId: string
}

export default function MyReservations() {
  const t = useTranslations('MyReservations')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const db = getFirestore()
          const reservationsRef = collection(db, 'reservations')
          const q = query(reservationsRef, where('userId', '==', user.uid))

          const querySnapshot = await getDocs(q)
          const reservationsData: Reservation[] = []

          querySnapshot.forEach((doc) => {
            const data = doc.data()
            let createdAtString = ''
            if (data.createdAt instanceof Timestamp) {
              createdAtString = data.createdAt.toDate().toLocaleString()
            } else if (data.createdAt?.seconds) {
              createdAtString = new Date(data.createdAt.seconds * 1000).toLocaleString()
            } else {
              createdAtString = 'Fecha no disponible'
            }

            reservationsData.push({
              id: doc.id,
              attendees: data.attendees || [],
              createdAt: createdAtString,
              currency: data.currency,
              numPeople: data.numPeople,
              paymentStatus: data.paymentStatus,
              scheduleId: data.scheduleId,
              totalAmount: data.totalAmount,
              visitTypeId: data.visitTypeId,
            })
          })

          // Ordenar por fecha usando los timestamps originales
          reservationsData.sort((a, b) => {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return dateB.getTime() - dateA.getTime()
          })

          setReservations(reservationsData)
        } catch (error) {
          console.error('Error fetching reservations:', error)
        } finally {
          setLoading(false)
        }
      } else {
        router.push('/auth')
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <CustomLoader />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('Title')}</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600 mb-6">{t('NoReservations')}</p>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2"
            onClick={() => router.push('/reservations')}
          >
            {t('MakeReservation')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <Card
              key={reservation.id}
              className="border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{reservation.visitTypeId}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('Date')}</p>
                      <p className="font-medium">{reservation.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('People')}</p>
                      <p className="font-medium">{reservation.numPeople}</p>
                    </div>
                  </div>

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

                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 font-medium flex items-center justify-center gap-2"
                    onClick={() => router.push(`/my-entries/${reservation.id}`)}
                  >
                    {t('ViewDetails')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
