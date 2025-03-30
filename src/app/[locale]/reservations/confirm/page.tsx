'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { toast } from 'sonner'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '@/app/[locale]/lib/firebase'
import ConfirmationForm, { FormData } from '@/app/[locale]/components/ConfirmationForm'
import { createCheckoutSession } from '@/app/[locale]/lib/stripe/checkout'
import { useTranslations } from 'next-intl'

function ConfirmPageContent() {
  const t = useTranslations('Rates.BookingForm')
  const searchParams = useSearchParams()
  const router = useRouter()

  const scheduleId = searchParams.get('scheduleId')
  const numPeople = parseInt(searchParams.get('numPeople') || '1', 10)
  const [userId, setUserId] = useState<string | null>(null)
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        const userRef = doc(db, 'users', user.uid)
        getDoc(userRef).then((userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data()
            setStripeCustomerId(userData.stripeCustomerId)
          }
        })
      } else {
        toast.error(t('LoginRedirection'))
        router.push(
          `/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
        )
      }
    })
    return () => unsubscribe()
  }, [router, t])

  const handleReservationSubmit = async (data: FormData) => {
    if (!userId || !scheduleId || !stripeCustomerId) {
      toast.error(t('UserError'))
      return
    }

    try {
      const scheduleRef = doc(db, 'schedules', scheduleId)
      const scheduleSnap = await getDoc(scheduleRef)
      if (!scheduleSnap.exists()) {
        toast.error(t('ScheduleError'))
        return
      }
      const scheduleData = scheduleSnap.data()
      if (scheduleData.availableSlots < numPeople) {
        toast.error(t('NoPlaces'))
        return
      }

      // Obtener el tipo de visita
      const visitTypeRef = doc(db, 'visitTypes', scheduleData.visitType)
      const visitTypeSnap = await getDoc(visitTypeRef)
      if (!visitTypeSnap.exists()) {
        toast.error('VisitDontExist')
        return
      }
      const visitTypeData = visitTypeSnap.data()

      // Guardar datos en localStorage
      localStorage.setItem(
        `reservation_${scheduleId}`,
        JSON.stringify({
          formData: data,
          userId,
          scheduleId,
          numPeople,
          visitTypeId: scheduleData.visitType,
          createdAt: new Date().toISOString(),
        }),
      )

      // Crear la sesión de checkout usando el stripePriceId del tipo de visita
      const { sessionId } = await createCheckoutSession({
        priceId: visitTypeData.stripePriceId,
        customerId: stripeCustomerId,
        metadata: {
          scheduleId,
          numPeople: numPeople.toString(),
        },
      })

      // Redirigir a la página de pago
      router.push(`/reservations/payment?session_id=${sessionId}`)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error(t('PaymentError'))
    }
  }

  return <ConfirmationForm numPeople={numPeople} onSubmit={handleReservationSubmit} />
}

export default function ConfirmPage() {
  const t = useTranslations('Rates.BookingForm')
  return (
    <Suspense fallback={<div>{t('Loading')}</div>}>
      <ConfirmPageContent />
    </Suspense>
  )
}
