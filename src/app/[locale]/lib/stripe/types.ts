export interface StripeVisitType {
  name: string
  shortDescription: string
  price: number
  features: string[]
  frequency: string
}

export interface StripeVisitTypeUpdate extends StripeVisitType {
  id: string
}

export interface CheckoutSessionParams {
  priceId: string
  customerId?: string
  metadata?: Record<string, string>
}

export interface StripeApiError {
  error: string
}

export interface SerializedSession {
  id: string
  customer: string
  payment_intent: string | null
  amount_total: number
  currency: string
  metadata: Record<string, string> | null
  status: string | null
}
