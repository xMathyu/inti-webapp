"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, ClockCircle, User } from "@mynaui/icons-react";
import { Badge } from "@/components/ui/badge";

export interface Schedule {
  id: string;
  visitType: string;
  mode: "individual" | "bulk";
  // For individual:
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  // For bulk (each document represents a day):
  startTime?: string;
  endTime?: string;
  availableSlots: number;
  active: boolean;
}

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  onToggleActive?: (schedule: Schedule) => void;
  hideBulkAndActions?: boolean;
}

export default function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  onToggleActive,
  hideBulkAndActions = false,
}: ScheduleCardProps) {
  const formatTime = (time: string | undefined) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleDateString("it-IT");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="mb-3">
        {!hideBulkAndActions && schedule.mode === "bulk" && (
          <Badge className="mb-2 text-white">Bulk</Badge>
        )}
        <h3 className="text-2xl font-bold text-green-800 mt-4">
          {schedule.visitType}
        </h3>
        <p className="text-black text-sm flex items-center mt-2">
          <Calendar className="mr-2 w-4 h-4" /> Data:{" "}
          {formatDate(schedule.date)}
        </p>
        {schedule.mode === "bulk" ? (
          <p className="text-black text-sm flex items-center mt-2">
            <ClockCircle className="mr-2 w-4 h-4" />{" "}
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </p>
        ) : (
          <p className="text-black text-sm flex items-center mt-2">
            <ClockCircle className="mr-2 w-4 h-4" /> {formatTime(schedule.time)}
          </p>
        )}
        <p className="text-black text-sm flex items-center mt-2">
          <User className="mr-2 w-4 h-4" /> Posti: {schedule.availableSlots}
        </p>
      </div>
      {!hideBulkAndActions && (
        <>
          <hr className="w-full my-4 border-t border-gray-300" />
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id={`switch-${schedule.id}`}
                checked={schedule.active}
                onCheckedChange={() =>
                  onToggleActive && onToggleActive(schedule)
                }
                className={schedule.active ? "bg-[#2563EF]" : "bg-gray-200"}
              />
              <span className="text-sm font-medium text-green-800">
                {schedule.active ? "Risorsa" : "Oziare"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => onEdit && onEdit(schedule)}
              >
                Modificare
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete && onDelete(schedule)}
              >
                Eliminare
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
