"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ScheduleCard, { Schedule } from "@/app/components/admin/ScheduleCard";
import ScheduleForm, {
  ScheduleFormData,
} from "@/app/components/admin/ScheduleForm";
import { toast } from "sonner";

const db = getFirestore();

export default function AdminSchedulesPanel() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "schedules"));
      const data: Schedule[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Schedule, "id">),
        });
      });
      setSchedules(data);
    } catch {
      toast.error("Error al cargar los horarios de reserva.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSave = async (data: ScheduleFormData) => {
    try {
      if (data.mode === "individual") {
        const docId = selectedSchedule
          ? selectedSchedule.id
          : `${data.visitType}_${data.date}_${data.time}`;
        await setDoc(doc(db, "schedules", docId), { ...data }, { merge: true });
        toast.success("Horario guardado con éxito.");
        setModalOpen(false);
        setSchedules((prev) => {
          const newItem = { id: docId, ...data } as Schedule;
          if (selectedSchedule) {
            return prev.map((item) =>
              item.id === selectedSchedule.id ? newItem : item
            );
          } else {
            return [newItem, ...prev];
          }
        });
      } else {
        // Bulk mode: Generar un horario por cada día del rango
        const start = new Date(data.startDate!);
        const end = new Date(data.endDate!);
        if (start > end) {
          throw new Error(
            "La fecha de inicio debe ser anterior a la fecha de fin."
          );
        }
        const dates: string[] = [];
        const current = new Date(start);
        while (current <= end) {
          dates.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
        for (const dateStr of dates) {
          const docId = `${data.visitType}_${dateStr}_${data.startTime}-${data.endTime}`;
          await setDoc(
            doc(db, "schedules", docId),
            {
              visitType: data.visitType,
              mode: "bulk",
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
        fetchSchedules();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error inesperado.");
      } else {
        toast.error("Error inesperado.");
      }
    }
  };

  const handleDelete = async (schedule: Schedule) => {
    try {
      await deleteDoc(doc(db, "schedules", schedule.id));
      toast.success("Horario eliminado.");
      setSchedules((prev) => prev.filter((item) => item.id !== schedule.id));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inesperado.";
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (schedule: Schedule) => {
    try {
      const newStatus = !schedule.active;
      await setDoc(
        doc(db, "schedules", schedule.id),
        { active: newStatus },
        { merge: true }
      );
      setSchedules((prev) =>
        prev.map((item) =>
          item.id === schedule.id ? { ...item, active: newStatus } : item
        )
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inesperado.";
      toast.error(errorMessage);
    }
  };

  const openModalForNew = () => {
    setSelectedSchedule(null);
    setModalOpen(true);
  };

  const openModalForEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow relative">
      {/* Cabecera con título único y botón a la derecha */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">
          Panel de Administración de Horarios de Reserva
        </h1>
        <Button
          onClick={openModalForNew}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus size={20} />
        </Button>
      </div>

      <ScheduleForm
        initialData={
          selectedSchedule
            ? {
                mode: selectedSchedule.mode,
                visitType: selectedSchedule.visitType,
                date: selectedSchedule.date,
                time: selectedSchedule.time,
                startTime: selectedSchedule.startTime,
                endTime: selectedSchedule.endTime,
                availableSlots: selectedSchedule.availableSlots,
                active: selectedSchedule.active,
              }
            : undefined
        }
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />

      <hr className="my-4" />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={openModalForEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
