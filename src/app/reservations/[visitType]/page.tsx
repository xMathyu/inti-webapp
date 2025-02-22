"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  getFirestore,
  doc,
  collection,
  runTransaction,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/lib/firebase";

const db = getFirestore();

export default function ReservationPage() {
  const { visitType } = useParams(); // Extrae el tipo de visita de la URL
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Debe estar autenticado para reservar.");
      }

      // Construye el ID del documento de horarios usando el tipo de visita, la fecha y la hora
      const scheduleDocId = `${visitType}_${date}_${time}`;
      const scheduleRef = doc(db, "schedules", scheduleDocId);

      await runTransaction(db, async (transaction) => {
        const scheduleDoc = await transaction.get(scheduleRef);
        if (!scheduleDoc.exists()) {
          throw new Error("El horario seleccionado no está disponible.");
        }
        const data = scheduleDoc.data();
        const availableSlots = data.availableSlots ?? 0;
        if (availableSlots < numPeople) {
          throw new Error(
            "No hay suficientes cupos disponibles para el horario seleccionado."
          );
        }
        // Descuenta los cupos
        transaction.update(scheduleRef, {
          availableSlots: availableSlots - numPeople,
        });

        // Registra la reserva en la colección "reservations"
        const reservationsRef = collection(db, "reservations");
        transaction.set(doc(reservationsRef), {
          userId: user.uid,
          visitType,
          date,
          time,
          numPeople,
          createdAt: new Date(),
        });
      });

      setMessage("Reserva realizada con éxito.");
      // Opcional: redirigir o limpiar el formulario
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-green-50 rounded shadow">
      <h1 className="text-xl font-bold text-green-800 mb-4">
        Reserva para: {visitType}
      </h1>
      <form onSubmit={handleReservation} className="space-y-4">
        <div>
          <Label htmlFor="date" className="block text-green-800">
            Fecha:
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time" className="block text-green-800">
            Hora:
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="numPeople" className="block text-green-800">
            Número de personas:
          </Label>
          <Input
            id="numPeople"
            type="number"
            value={numPeople}
            min="1"
            onChange={(e) => setNumPeople(parseInt(e.target.value))}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Reservar
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}
    </div>
  );
}
