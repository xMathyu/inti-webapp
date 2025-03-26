'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { getCheckoutSession } from '@/app/[locale]/lib/stripe/checkout'
import CustomLoader from '@/components/CustomLoader'
import Link from 'next/link'

// Cargar Stripe (fuera del componente para evitar recargas múltiples)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function PaymentPageContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No se encontró el ID de la sesión de pago')
      setLoading(false)
      return
    }

    const fetchClientSecret = async () => {
      try {
        const session = await getCheckoutSession(sessionId)
        setClientSecret(session.client_secret)
      } catch (err) {
        console.error('Error al obtener la sesión de checkout:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar la información de pago')
      } finally {
        setLoading(false)
      }
    }

    fetchClientSecret()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CustomLoader />
      </div>
    )
  }

  if (error || !clientSecret) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto p-6 bg-red-50 rounded-md text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Error al cargar el pago</h2>
          <p className="text-red-600 mb-6">{error || 'No se pudo crear la sesión de pago'}</p>
          <Link
            href="/reservations"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Volver a reservas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Finaliza tu reserva</h1>

        <div className="bg-white rounded-md shadow-md overflow-hidden">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
