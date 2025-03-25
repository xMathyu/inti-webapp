"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/app/lib/firebase";
import ConfirmationForm, { FormData } from "@/app/components/ConfirmationForm";
import { createCheckoutSession } from "@/app/lib/stripe/checkout";

function ConfirmPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scheduleId = searchParams.get("scheduleId");
  const numPeople = parseInt(searchParams.get("numPeople") || "1", 10);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setStripeCustomerId(userData.stripeCustomerId);
          }
        });
      } else {
        toast.error("Per confermare la prenotazione è necessario aver effettuato il login.");
        router.push(
          `/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
        );
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleReservationSubmit = async (data: FormData) => {
    if (!userId || !scheduleId || !stripeCustomerId) {
      toast.error("Errore nel recupero dei dati dell'utente o della prenotazione.");
      return;
    }

    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);
      if (!scheduleSnap.exists()) {
        toast.error("L'orario selezionato non esiste.");
        return;
      }
      const scheduleData = scheduleSnap.data();
      if (scheduleData.availableSlots < numPeople) {
        toast.error("Non ci sono abbastanza posti disponibili.");
        return;
      }

      // Obtener el tipo de visita
      const visitTypeRef = doc(db, "visitTypes", scheduleData.visitType);
      const visitTypeSnap = await getDoc(visitTypeRef);
      if (!visitTypeSnap.exists()) {
        toast.error("Il tipo di visita non esiste.");
        return;
      }
      const visitTypeData = visitTypeSnap.data();

      // Guardar datos en localStorage
      localStorage.setItem(
        `reservation_${scheduleId}`,
        JSON.stringify({
          formData: data,
          userId,
          scheduleId,
          numPeople,
          createdAt: new Date().toISOString(),
        }),
      );

      // Crear la sesión de checkout usando el stripePriceId del tipo de visita
      const { sessionId } = await createCheckoutSession({
        priceId: visitTypeData.stripePriceId,
        customerId: stripeCustomerId,
        metadata: {
          scheduleId,
          numPeople: numPeople.toString(),
        },
      });

      // Redirigir a la página de pago
      router.push(`/reservations/payment?session_id=${sessionId}`);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Si è verificato un errore durante la preparazione del pagamento.");
    }
  };

  return <ConfirmationForm numPeople={numPeople} onSubmit={handleReservationSubmit} />;
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}
