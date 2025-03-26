import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email e nome sono obbligatori" },
        { status: 400 }
      );
    }

    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Errore durante la creazione del cliente in Stripe:", error);
    return NextResponse.json(
      { error: "Errore durante la creazione del cliente" },
      { status: 500 }
    );
  }
}
