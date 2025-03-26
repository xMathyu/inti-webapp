import { handleStripeResponse, stripeHeaders } from './utils'

export async function createStripeCustomer(email: string, userId: string): Promise<string> {
  try {
    const response = await fetch('/api/stripe/customers', {
      method: 'POST',
      headers: stripeHeaders,
      body: JSON.stringify({ email, userId }),
    })

    const customer = await handleStripeResponse<{ id: string }>(response)
    return customer.id
  } catch (error) {
    console.error('Error durante la creación del cliente en Stripe:', error)
    throw error
  }
}
