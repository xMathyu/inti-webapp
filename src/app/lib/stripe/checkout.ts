import { CheckoutSessionParams } from "./types";
import { handleStripeResponse, stripeHeaders } from "./utils";
import { Stripe } from "stripe";

export async function createCheckoutSession(params: CheckoutSessionParams) {
  try {
    const response = await fetch("/api/stripe/checkout-session", {
      method: "POST",
      headers: stripeHeaders,
      body: JSON.stringify(params),
    });

    return handleStripeResponse<{
      sessionId: string;
      url: string;
      client_secret: string;
    }>(response);
  } catch (error) {
    console.error("Error durante la creación de la sesión de checkout:", error);
    throw error;
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const response = await fetch(`/api/stripe/checkout-session?sessionId=${sessionId}`);
    return handleStripeResponse<Stripe.Checkout.Session>(response);
  } catch (error) {
    console.error("Error durante la recuperación de la sesión de checkout:", error);
    throw error;
  }
}
