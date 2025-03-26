import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'

export async function POST(req: Request) {
  try {
    const { priceId, customerId, metadata } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'ID del prezzo è obbligatorio' }, { status: 400 })
    }

    // Obtener la cantidad de personas desde los metadatos
    const numPeople = metadata?.numPeople ? parseInt(metadata.numPeople, 10) : 1

    // Configurar los parámetros de la sesión
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: numPeople,
        },
      ],
      mode: 'payment',
      metadata: metadata || {},
      ui_mode: 'embedded',
      return_url: `${frontendUrl}/reservations/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      client_secret: session.client_secret,
    })
  } catch (error) {
    console.error('Errore durante la creazione della sessione di checkout:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione della sessione di checkout' },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'ID della sessione è obbligatorio' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json(session)
  } catch (error) {
    console.error('Errore durante il recupero della sessione di checkout:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero della sessione di checkout' },
      { status: 500 },
    )
  }
}
