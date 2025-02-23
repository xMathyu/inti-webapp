"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface Schedule {
  id: string;
  visitType: string;
  date: string;
  time: string;
  availableSlots: number;
  active: boolean;
}

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onToggleActive: (schedule: Schedule) => void;
}

export default function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  onToggleActive,
}: ScheduleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="mb-3">
        <h3 className="text-2xl font-bold text-green-800">
          {schedule.visitType}
        </h3>
        <p className="text-green-700">
          {schedule.date} - {schedule.time}
        </p>
        <p className="text-gray-600 mt-2">Cupos: {schedule.availableSlots}</p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id={`switch-${schedule.id}`}
            checked={schedule.active}
            onCheckedChange={() => onToggleActive(schedule)}
          />
          <span className="text-sm font-medium text-green-800">
            {schedule.active ? "Activo" : "Inactivo"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => onEdit(schedule)}>
            Editar
          </Button>
          <Button variant="destructive" onClick={() => onDelete(schedule)}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
