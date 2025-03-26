import { StripeApiError } from './types'

export async function handleStripeResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json()) as StripeApiError
    throw new Error(error.error || 'Error en la operación de Stripe')
  }
  return response.json()
}

export const stripeHeaders = {
  'Content-Type': 'application/json',
}
