"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export interface ScheduleFormData {
  visitType: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  availableSlots: number;
  active: boolean;
}

interface ScheduleFormProps {
  initialData?: ScheduleFormData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ScheduleFormData) => Promise<void>;
}

interface VisitTypeOption {
  id: string;
  name: string;
}

export default function ScheduleForm({
  initialData,
  isOpen,
  onOpenChange,
  onSave,
}: ScheduleFormProps) {
  // Campos del formulario
  const [visitType, setVisitType] = useState(initialData?.visitType || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [availableSlots, setAvailableSlots] = useState(
    initialData ? initialData.availableSlots.toString() : ""
  );
  const [active, setActive] = useState(initialData?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Opciones para el desplegable "Tipo de Visita"
  const [visitTypesOptions, setVisitTypesOptions] = useState<VisitTypeOption[]>(
    []
  );

  useEffect(() => {
    // Consulta a Firestore para obtener las opciones de tipos de visita
    const fetchVisitTypesOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const options: VisitTypeOption[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Asumimos que cada documento tiene un campo "name"
          options.push({
            id: docSnap.id,
            name: data.name,
          });
        });
        setVisitTypesOptions(options);
      } catch (error) {
        console.error("Error al cargar los tipos de visita:", error);
      }
    };
    fetchVisitTypesOptions();
  }, []);

  // Reinicia o actualiza el formulario cuando se abra el modal
  useEffect(() => {
    if (isOpen && !initialData) {
      setVisitType("");
      setDate("");
      setTime("");
      setAvailableSlots("");
      setActive(true);
    } else if (initialData) {
      setVisitType(initialData.visitType);
      setDate(initialData.date);
      setTime(initialData.time);
      setAvailableSlots(initialData.availableSlots.toString());
      setActive(initialData.active);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    const slots = parseInt(availableSlots);
    if (isNaN(slots)) {
      setLocalError("La cantidad de cupos debe ser un número válido.");
      setLoading(false);
      return;
    }
    const formData: ScheduleFormData = {
      visitType,
      date,
      time,
      availableSlots: slots,
      active,
    };
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message || "Error al guardar.");
      } else {
        setLocalError("Error al guardar.");
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Editar Horario de Reserva"
              : "Agregar Horario de Reserva"}
          </DialogTitle>
          <DialogDescription>
            Ingresa el tipo de visita, día, hora y cupos disponibles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="visitType" className="block text-green-800">
              Tipo de Visita:
            </Label>
            <select
              id="visitType"
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Seleccione un tipo de visita</option>
              {visitTypesOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
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
            <Label htmlFor="availableSlots" className="block text-green-800">
              Cupos Disponibles:
            </Label>
            <Input
              id="availableSlots"
              type="number"
              value={availableSlots}
              onChange={(e) => setAvailableSlots(e.target.value)}
              placeholder="Ej: 30"
              required
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="active" className="text-green-800 mr-2">
              Activo:
            </Label>
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
          {localError && <p className="text-red-500">{localError}</p>}
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {initialData ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
