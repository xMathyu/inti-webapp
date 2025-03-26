import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    const { name, shortDescription, price, features, frequency } = await req.json()

    if (!name || !price) {
      return NextResponse.json({ error: 'ID, nome e prezzo sono obbligatori' }, { status: 400 })
    }

    // Crear el producto en Stripe
    const product = await stripe.products.create({
      name,
      description: shortDescription,
      metadata: {
        features: JSON.stringify(features),
        frequency: frequency,
      },
    })

    // Crear el precio para el producto
    const priceObject = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100, // Stripe usa centavos
      currency: 'eur',
    })

    return NextResponse.json({
      productId: product.id,
      priceId: priceObject.id,
    })
  } catch (error) {
    console.error('Errore durante la creazione del prodotto in Stripe:', error)
    return NextResponse.json({ error: 'Errore durante la creazione del prodotto' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, shortDescription, price, features, frequency } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID del prodotto è obbligatorio' }, { status: 400 })
    }

    // Actualizar el producto
    await stripe.products.update(id, {
      name,
      description: shortDescription,
      metadata: {
        features: JSON.stringify(features),
        frequency: frequency,
      },
    })

    // Obtener el precio activo actual
    const prices = await stripe.prices.list({
      product: id,
      active: true,
      limit: 1,
    })

    let newPriceId = null

    // Si el precio ha cambiado, crear uno nuevo y desactivar el anterior
    if (prices.data.length > 0 && prices.data[0].unit_amount !== price * 100) {
      // Desactivar el precio anterior
      await stripe.prices.update(prices.data[0].id, { active: false })

      // Crear nuevo precio
      const newPrice = await stripe.prices.create({
        product: id,
        unit_amount: price * 100,
        currency: 'eur',
      })

      newPriceId = newPrice.id
    }

    return NextResponse.json({
      success: true,
      priceId: newPriceId,
    })
  } catch (error) {
    console.error("Errore durante l'aggiornamento del prodotto in Stripe:", error)
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento del prodotto" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID del prodotto è obbligatorio' }, { status: 400 })
    }

    await stripe.products.update(id, { active: false })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore durante l'eliminazione del prodotto in Stripe:", error)
    return NextResponse.json(
      { error: "Errore durante l'eliminazione del prodotto" },
      { status: 500 },
    )
  }
}
