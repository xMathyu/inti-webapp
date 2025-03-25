import { redirect } from "next/navigation";
import Stripe from "stripe";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { ClientConfirmationPage } from "./ClientConfirmationPage";
import { SerializedSession } from "@/app/lib/stripe/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PageProps {
  params: {}; // Parámetros de ruta
  searchParams: { [key: string]: string | string[] | undefined }; // Parámetros de búsqueda
}

// Función auxiliar para convertir la sesión de Stripe en un objeto plano
function serializeSession(session: Stripe.Checkout.Session): SerializedSession {
  return {
    id: session.id,
    customer: session.customer as string,
    payment_intent: session.payment_intent,
    amount_total: session.amount_total as number,
    currency: session.currency as string,
    metadata: session.metadata,
    status: session.status,
  };
}

export default async function ConfirmedPage(props: PageProps) {
  // Obtener el session_id de los parámetros de búsqueda (query parameters)
  const searchParams = await props.searchParams;
  const session_id = searchParams.session_id as string | undefined;

  if (!session_id) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p>Please provide a valid session_id.</p>
        <a href="/" className="text-blue-500 underline">
          Return to homepage
        </a>
      </div>
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    if (session.status === "open") {
      redirect("/");
    }

    if (session.status === "complete") {
      // Verificar si ya existe una reserva con este session_id
      const reservationsRef = collection(db, "reservations");
      const q = query(reservationsRef, where("stripeSessionId", "==", session_id));
      const querySnapshot = await getDocs(q);

      // Si encontramos una reserva existente, retornar su ID
      if (!querySnapshot.empty) {
        const existingReservation = querySnapshot.docs[0];
        return <ClientConfirmationPage reservationId={existingReservation.id} scheduleId={null} />;
      }

      const scheduleId = session.metadata?.scheduleId;
      if (!scheduleId) {
        throw new Error("No se encontró el ID del horario");
      }

      // Serializar la sesión antes de pasarla al Client Component
      const serializedSession = serializeSession(session);

      return <ClientConfirmationPage scheduleId={scheduleId} session={serializedSession} />;
    }

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Session not complete</h1>
        <p>The payment session is not complete yet.</p>
        <a href="/" className="text-blue-500 underline">
          Return to homepage
        </a>
      </div>
    );
  } catch (error) {
    console.error("Error processing session:", error);
    return <ClientConfirmationPage error={true} scheduleId={null} />;
  }
}
