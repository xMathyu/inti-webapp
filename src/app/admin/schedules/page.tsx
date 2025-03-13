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
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/app/shared/DateRangePicker";

const db = getFirestore();

export default function AdminSchedulesPanel() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));

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
      toast.error("Errore durante il caricamento degli orari di prenotazione.");
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
        toast.success("Orario salvato con successo.");
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
            "La data di inizio deve essere precedente alla data di fine."
          );
        }
        const dates: string[] = [];
        const current = new Date(start);
        while (current <= end) {
          dates.push(current.toLocaleDateString("it-IT", { timeZone: "UTC" }));
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
        toast.success("Orari creati con successo.");
        setModalOpen(false);
        fetchSchedules();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Errore inaspettato.");
      } else {
        toast.error("Errore inaspettato.");
      }
    }
  };

  const handleDelete = async (schedule: Schedule) => {
    try {
      await deleteDoc(doc(db, "schedules", schedule.id));
      toast.success("Orario eliminato.");
      setSchedules((prev) => prev.filter((item) => item.id !== schedule.id));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Errore inaspettato.";
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
        err instanceof Error ? err.message : "Errore inaspettato.";
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

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) setStartDate(range.from);
    if (range?.to) setEndDate(range.to);
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const scheduleDate = schedule.date ? new Date(schedule.date) : new Date();
    return scheduleDate >= startDate && scheduleDate <= endDate;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow relative">
      {/* Cabecera con título único y botón a la derecha */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">
          Pannello di amministrazione del programma di prenotazione
        </h1>
        <Button
          onClick={openModalForNew}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus size={20} />
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-green-800 font-bold mb-2">
          Seleziona data di inizio e fine:
        </label>
        <DatePickerWithRange onDateChange={handleDateChange} />
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
        <p>Caricamento...</p>
      ) : filteredSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={openModalForEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <p>Non è previsto un programma di prenotazione per questo periodo.</p>
      )}
    </div>
  );
}
