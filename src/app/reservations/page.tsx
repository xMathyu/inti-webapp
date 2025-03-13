"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { db } from "@/app/lib/firebase";

interface VisitTypeOption {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  visitType: string;
  mode: "individual" | "bulk";
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  availableSlots: number;
  active: boolean;
}

const ReservationsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [visitType, setVisitType] = useState("");
  const [date, setDate] = useState("");
  const [numPeople, setNumPeople] = useState(1);

  const [visitTypesOptions, setVisitTypesOptions] = useState<VisitTypeOption[]>(
    []
  );
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisitTypes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const options: VisitTypeOption[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          options.push({ id: docSnap.id, name: data.name });
        });
        setVisitTypesOptions(options);
      } catch (err) {
        console.error("Error al cargar tipos de visita:", err);
      }
    };
    fetchVisitTypes();
  }, []);

  // Lee "?type=..." para preseleccionar el dropdown
  useEffect(() => {
    const preselectedType = searchParams.get("type");
    if (preselectedType) {
      setVisitType(preselectedType);
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAvailableSchedules([]);

    if (!visitType || !date || numPeople < 1) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    setLoading(true);

    try {
      const schedulesRef = collection(db, "schedules");
      const q = query(
        schedulesRef,
        where("visitType", "==", visitType),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      const schedules: Schedule[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Schedule, "id">;
        if (data.active && data.availableSlots >= numPeople) {
          if (data.mode === "bulk") {
            schedules.push({
              id: docSnap.id,
              visitType: data.visitType,
              mode: "individual",
              date: data.date,
              time: data.startTime,
              availableSlots: data.availableSlots,
              active: data.active,
            });
          } else {
            schedules.push({ id: docSnap.id, ...data });
          }
        }
      });

      if (schedules.length === 0) {
        toast.error(
          "No hay horarios disponibles para la fecha y cupos solicitados."
        );
      } else {
        setAvailableSchedules(schedules);
        toast.success("Horarios disponibles encontrados.");
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message || "Error al buscar horarios.");
      } else {
        toast.error("Error al buscar horarios.");
      }
    }
    setLoading(false);
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    router.push(
      `/reservations/confirm?scheduleId=${encodeURIComponent(schedule.id)}&numPeople=${numPeople}`
    );
  };  

  return (
    <div className="max-w-md mx-auto p-4 bg-green-50 rounded shadow">
      <h1 className="text-xl font-bold text-green-800 mb-4">
        Realiza tu Reserva
      </h1>

      <form onSubmit={handleSearch} className="space-y-4">
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
          <Label htmlFor="numPeople" className="block text-green-800">
            Número de Personas:
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
          {loading ? "Buscando..." : "Buscar Horarios"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {availableSchedules.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-green-800 mb-4">
            Horarios Disponibles
          </h2>
          <ul className="space-y-4">
            {availableSchedules.map((schedule) => (
              <li
                key={schedule.id}
                className="p-4 border rounded bg-white cursor-pointer hover:shadow-lg"
                onClick={() => handleSelectSchedule(schedule)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-800">
                    {schedule.visitType}
                  </span>
                </div>
                <p className="text-green-700">
                  {schedule.date} - {schedule.time}
                </p>
                <p className="text-gray-600">
                  Cupos Disponibles: {schedule.availableSlots}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ReservationsPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReservationsPage />
  </Suspense>
);

export default ReservationsPageWrapper;
