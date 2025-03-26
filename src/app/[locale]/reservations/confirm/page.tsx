"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/app/[locale]/lib/firebase";
import ConfirmationForm, {
  FormData,
} from "@/app/[locale]/components/ConfirmationForm";

function ConfirmPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scheduleId = searchParams.get("scheduleId");
  const numPeople = parseInt(searchParams.get("numPeople") || "1", 10);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        toast.error(
          "Per confermare la prenotazione è necessario aver effettuato il login."
        );
        router.push(
          `/auth?redirect=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleReservationSubmit = async (data: FormData) => {
    if (!userId || !scheduleId) {
      toast.error(
        "Errore nel recupero dei dati dell'utente o della prenotazione."
      );
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

      // Register the reservation
      await addDoc(collection(db, "reservations"), {
        userId,
        scheduleId,
        attendees: data.attendees,
        createdAt: new Date(),
      });

      // Update available slots
      await updateDoc(scheduleRef, {
        availableSlots: scheduleData.availableSlots - numPeople,
      });

      toast.success("Prenotazione confermata con successo.");
      router.push("/reservations");
    } catch (error) {
      console.error("Error saving the reservation:", error);
      toast.error(
        "Si è verificato un errore durante la conferma della prenotazione."
      );
    }
  };

  return (
    <ConfirmationForm
      numPeople={numPeople}
      onSubmit={handleReservationSubmit}
    />
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}
