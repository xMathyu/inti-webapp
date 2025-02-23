"use client";

import { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BulkScheduleForm, {
  BulkScheduleFormData,
} from "@/app/components/admin/BulkScheduleForm";
import { toast } from "sonner";

const db = getFirestore();

export default function BulkSchedulesPanel() {
  const [modalOpen, setModalOpen] = useState(false);

  // En este ejemplo, no listamos los horarios en bloque porque la generación masiva
  // es una acción puntual. Puedes combinar este panel con la lista de horarios si lo deseas.

  const handleBulkSave = async (data: BulkScheduleFormData) => {
    try {
      // Se generan horarios para cada día en el rango
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start > end) {
        throw new Error(
          "La fecha de inicio debe ser anterior a la fecha de fin."
        );
      }
      const dates: string[] = [];
      const current = new Date(start);
      while (current <= end) {
        dates.push(current.toISOString().split("T")[0]); // formato YYYY-MM-DD
        current.setDate(current.getDate() + 1);
      }
      // Para cada día, se crea un documento de horario con el rango de horas especificado.
      for (const dateStr of dates) {
        // Generamos un ID de documento único usando el tipo de visita, fecha y el rango de horas.
        const docId = `${data.visitType}_${dateStr}_${data.startTime}-${data.endTime}`;
        await setDoc(
          doc(db, "schedules", docId),
          {
            visitType: data.visitType,
            date: dateStr,
            startTime: data.startTime,
            endTime: data.endTime,
            availableSlots: data.availableSlots,
            active: data.active,
          },
          { merge: true }
        );
      }
      toast.success("Horarios creados con éxito.");
      setModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error al crear los horarios.");
      } else {
        toast.error("Error al crear los horarios.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-green-50 rounded shadow relative">
      {/* Cabecera con título y botón para abrir el formulario en bloque */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">
          Horarios en Bloque
        </h1>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus size={20} />
        </Button>
      </div>

      <BulkScheduleForm
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleBulkSave}
      />
    </div>
  );
}
