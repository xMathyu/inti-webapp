"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { VisitTypeOption } from "@/app/interfaces/interfaces";

export type ScheduleMode = "individual" | "bulk";

export interface ScheduleFormData {
  mode: ScheduleMode;
  visitType: string;
  // For individual mode:
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  // For bulk mode:
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  availableSlots: number;
  active: boolean;
}

export interface ScheduleFormProps {
  initialData?: ScheduleFormData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ScheduleFormData) => Promise<void>;
}

export default function ScheduleForm({
  initialData,
  isOpen,
  onOpenChange,
  onSave,
}: ScheduleFormProps) {
  // If editing a bulk schedule, we want to display it in individual mode
  const [mode, setMode] = useState<ScheduleMode>(
    initialData?.mode || "individual"
  );
  const [visitType, setVisitType] = useState(initialData?.visitType || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [availableSlots, setAvailableSlots] = useState(
    initialData ? initialData.availableSlots.toString() : ""
  );
  const [active, setActive] = useState(initialData?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Options for the "Visit Type" dropdown
  const [visitTypesOptions, setVisitTypesOptions] = useState<VisitTypeOption[]>(
    []
  );

  useEffect(() => {
    const fetchVisitTypesOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const options: VisitTypeOption[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          options.push({ id: docSnap.id, name: data.name });
        });
        setVisitTypesOptions(options);
      } catch (error) {
        console.error("Error al cargar los tipos de visita:", error);
      }
    };
    fetchVisitTypesOptions();
  }, []);

  useEffect(() => {
    if (isOpen && !initialData) {
      setMode("individual");
      setVisitType("");
      setDate("");
      setTime("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setAvailableSlots("");
      setActive(true);
      setLocalError("");
    } else if (initialData) {
      // If the schedule was created in bulk mode, convert it to individual mode for editing
      if (initialData.mode === "bulk") {
        setMode("individual");
        setVisitType(initialData.visitType);
        setDate(initialData.date || "");
        setTime(initialData.startTime || ""); // Use startTime as the reservation time
        setAvailableSlots(initialData.availableSlots.toString());
        setActive(initialData.active);
        // Clear bulk fields
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
      } else {
        setMode(initialData.mode);
        setVisitType(initialData.visitType);
        setDate(initialData.date || "");
        setTime(initialData.time || "");
        setAvailableSlots(initialData.availableSlots.toString());
        setActive(initialData.active);
        setStartDate(initialData.startDate || "");
        setEndDate(initialData.endDate || "");
        setStartTime(initialData.startTime || "");
        setEndTime(initialData.endTime || "");
      }
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
    if (!visitType) {
      setLocalError("Seleccione un tipo de visita.");
      setLoading(false);
      return;
    }
    if (mode === "individual") {
      if (!date || !time) {
        setLocalError("Complete la fecha y la hora.");
        setLoading(false);
        return;
      }
    } else {
      if (!startDate || !endDate || !startTime || !endTime) {
        setLocalError("Complete el rango de fechas y horas.");
        setLoading(false);
        return;
      }
    }
    const formData: ScheduleFormData = {
      mode,
      visitType,
      availableSlots: slots,
      active,
      ...(mode === "individual"
        ? { date, time }
        : { startDate, endDate, startTime, endTime }),
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
            Ingresa la información del horario.
          </DialogDescription>
        </DialogHeader>
        {/* Mode selector */}
        <div className="mb-4">
          <Label htmlFor="mode" className="block text-green-800 mb-1">
            Modo:
          </Label>
          <select
            id="mode"
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as ScheduleFormData["mode"])
            }
            className="border rounded p-2 w-full"
          >
            <option value="individual">Individual</option>
            <option value="bulk">En Bloque</option>
          </select>
        </div>
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
          {mode === "individual" ? (
            <>
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
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="startDate" className="block text-green-800">
                  Fecha de Inicio:
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="block text-green-800">
                  Fecha de Fin:
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="block text-green-800">
                    Hora de Inicio:
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="block text-green-800">
                    Hora de Fin:
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}
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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Creando..." : "Guardar Horario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
