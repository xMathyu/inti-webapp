"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scheduleId = searchParams.get("scheduleId");
  const numPeople = parseInt(searchParams.get("numPeople") || "1", 10);

  const [userId, setUserId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState(
    Array.from({ length: numPeople }, () => ({
      firstName: "",
      lastName: "",
      cie: "",
      phone: "",
    }))
  );

  // Obtener usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        toast.error("Debes iniciar sesión para confirmar la reserva.");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index] = { ...updatedAttendees[index], [field]: value };
    setAttendees(updatedAttendees);
  };

  const handleSubmit = async () => {
    if (attendees.some((a) => !a.firstName || !a.lastName || !a.cie || !a.phone)) {
      toast.error("Por favor, complete todos los datos.");
      return;
    }

    if (!userId || !scheduleId) {
      toast.error("Error al obtener datos del usuario o de la reserva.");
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

      // Guardar la reserva en Firestore
      await addDoc(collection(db, "reservations"), {
        userId,
        scheduleId,
        attendees,
        createdAt: new Date(),
      });

      // Actualizar cupos disponibles en el horario
      await updateDoc(scheduleRef, {
        availableSlots: scheduleData.availableSlots - numPeople,
      });

      toast.success("Reserva confirmada con éxito.");
      router.push("/reservations");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      toast.error("Hubo un error al confirmar la reserva.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-green-50 rounded shadow">
      <h1 className="text-xl font-bold text-green-800 mb-4">Confirmación de Reserva</h1>
      <p className="text-green-700">Ingrese los datos de los asistentes:</p>

      {attendees.map((attendee, index) => (
        <div key={index} className="border rounded p-4 bg-white my-2">
          <h2 className="font-bold text-green-800">Asistente {index + 1}</h2>

          <Label>Nombre:</Label>
          <Input
            type="text"
            value={attendee.firstName}
            onChange={(e) => handleChange(index, "firstName", e.target.value)}
            required
          />

          <Label>Apellido:</Label>
          <Input
            type="text"
            value={attendee.lastName}
            onChange={(e) => handleChange(index, "lastName", e.target.value)}
            required
          />

          <Label>CIE:</Label>
          <Input
            type="text"
            value={attendee.cie}
            onChange={(e) => handleChange(index, "cie", e.target.value)}
            required
          />

          <Label>Teléfono:</Label>
          <Input
            type="tel"
            value={attendee.phone}
            onChange={(e) => handleChange(index, "phone", e.target.value)}
            required
          />
        </div>
      ))}

      <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4" onClick={handleSubmit}>
        Confirmar Reserva
      </Button>
    </div>
  );
};

export default ConfirmationPage;