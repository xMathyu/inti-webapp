import { StripeVisitType, StripeVisitTypeUpdate } from './types'
import { handleStripeResponse, stripeHeaders } from './utils'

export async function createStripeProduct(visitType: StripeVisitType) {
  try {
    const response = await fetch('/api/stripe/products', {
      method: 'POST',
      headers: stripeHeaders,
      body: JSON.stringify(visitType),
    })

    return handleStripeResponse<{ productId: string; priceId: string }>(response)
  } catch (error) {
    console.error('Error durante la creación del producto en Stripe:', error)
    throw error
  }
}

export async function updateStripeProduct(visitType: StripeVisitTypeUpdate) {
  try {
    const response = await fetch('/api/stripe/products', {
      method: 'PUT',
      headers: stripeHeaders,
      body: JSON.stringify(visitType),
    })

    return handleStripeResponse<{ success: boolean; priceId?: string }>(response)
  } catch (error) {
    console.error('Error durante la actualización del producto en Stripe:', error)
    throw error
  }
}

export async function deleteStripeProduct(productId: string) {
  try {
    const response = await fetch(`/api/stripe/products?id=${productId}`, {
      method: 'DELETE',
    })

    return handleStripeResponse<{ success: boolean }>(response)
  } catch (error) {
    console.error('Error durante la eliminación del producto en Stripe:', error)
    throw error
  }
}
