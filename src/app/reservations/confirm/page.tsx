"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/app/lib/firebase";
import ConfirmationForm, { FormData } from "@/app/components/ConfirmationForm";

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
        toast.error("Debes iniciar sesión para confirmar la reserva.");
        router.push("/auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleReservationSubmit = async (data: FormData) => {
    if (!userId || !scheduleId) {
      toast.error("Error al recuperar los datos del usuario o de la reserva.");
      return;
    }
    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);
      if (!scheduleSnap.exists()) {
        toast.error("El horario seleccionado no existe.");
        return;
      }
      const scheduleData = scheduleSnap.data();
      if (scheduleData.availableSlots < numPeople) {
        toast.error("No hay suficientes cupos disponibles.");
        return;
      }

      // Registrar la reserva
      await addDoc(collection(db, "reservations"), {
        userId,
        scheduleId,
        attendees: data.attendees,
        createdAt: new Date(),
      });

      // Actualizar cupos disponibles
      await updateDoc(scheduleRef, {
        availableSlots: scheduleData.availableSlots - numPeople,
      });

      toast.success("Reserva confirmada con éxito.");
      router.push("/reservations");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      toast.error("Se produjo un error al confirmar la reserva.");
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
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}
