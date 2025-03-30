import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/app/[locale]/lib/firebase'
import { ClientConfirmationPage } from './ClientConfirmationPage'
import { SerializedSession } from '@/app/[locale]/lib/stripe/types'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Función auxiliar para convertir la sesión de Stripe en un objeto plano
function serializeSession(session: Stripe.Checkout.Session): SerializedSession {
  // Manejar el tipo de payment_intent adecuadamente
  let paymentIntent: string | null = null
  if (typeof session.payment_intent === 'string') {
    paymentIntent = session.payment_intent
  } else if (session.payment_intent && 'id' in session.payment_intent) {
    paymentIntent = session.payment_intent.id
  }

  return {
    id: session.id,
    customer: session.customer as string,
    payment_intent: paymentIntent,
    amount_total: session.amount_total as number,
    currency: session.currency as string,
    metadata: session.metadata,
    status: session.status,
  }
}

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, unknown>>
}) {
  // Obtener el session_id de los parámetros de búsqueda (query parameters)
  const session_id = (await searchParams)!.session_id as string | undefined

  const t = await getTranslations('Reservations')

  if (!session_id) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p>{t('InvalidId')}</p>
        <Link href="/" className="text-blue-500 underline">
          {t('Return')}
        </Link>
      </div>
    )
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent'],
    })

    if (session.status === 'open') {
      redirect('/')
    }

    if (session.status === 'complete') {
      // Verificar si ya existe una reserva con este session_id
      const reservationsRef = collection(db, 'reservations')
      const q = query(reservationsRef, where('stripeSessionId', '==', session_id))
      const querySnapshot = await getDocs(q)

      // Si encontramos una reserva existente, retornar su ID
      if (!querySnapshot.empty) {
        const existingReservation = querySnapshot.docs[0]
        return <ClientConfirmationPage reservationId={existingReservation.id} scheduleId={null} />
      }

      const scheduleId = session.metadata?.scheduleId
      if (!scheduleId) {
        throw new Error('No se encontró el ID del horario')
      }

      // Serializar la sesión antes de pasarla al Client Component
      const serializedSession = serializeSession(session)

      return <ClientConfirmationPage scheduleId={scheduleId} session={serializedSession} />
    }

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4"> {t('SesionUncompleted')}</h1>
        <p>{t('PaymentUncompleted')}</p>
        <Link href="/" className="text-blue-500 underline">
          {t('Return')}
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error processing session:', error)
    return <ClientConfirmationPage error={true} scheduleId={null} />
  }
}
