import { SubmitHandler } from "react-hook-form";

export interface Visit {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  frequency: string;
  features: string[];
  active: boolean;
}

export interface VisitOrder extends Visit {
  order: string;
}

export interface VisitTypeOption {
  id: string;
  name: string;
}

export interface BulkScheduleFormData {
  visitType: string;
  startDate: string; // format YYYY-MM-DD
  endDate: string; // format YYYY-MM-DD
  startTime: string; // format HH:MM
  endTime: string; // format HH:MM
  availableSlots: number;
  active: boolean;
}

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

export interface ScheduleCardProps {
  schedule: Schedule;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  onToggleActive?: (schedule: Schedule) => void;
  hideBulkAndActions?: boolean;
}

export interface VisitTypeOption {
  id: string;
  name: string;
}

export interface VisitType {
  id: string;
  name: string;
  price: number;
  frequency: string;
  shortDescription: string;
  features: string[];
  active: boolean;
}

export interface VisitTypeCardProps {
  visit: VisitType;
  onEdit: (visit: VisitType) => void;
  onDelete: (visit: VisitType) => void;
  onToggleActive: (visit: VisitType) => void;
}

export interface VisitTypeFormData {
  name: string;
  price: number;
  frequency: string;
  shortDescription: string;
  features: string[];
  active: boolean;
}

export interface VisitTypeFormProps {
  initialData?: VisitTypeFormData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: VisitTypeFormData) => Promise<void>;
}

export interface AvailableSchedulesProps {
  schedules: Schedule[];
  handleSelectSchedule: (schedule: Schedule) => void;
}

export interface Attendee {
  firstName: string;
  lastName: string;
  documentType: "CIE" | "Passaporto";
  documentNumber: string;
  phone: string;
  email: string;
  birthDate: string;
}

export interface FormData {
  attendees: Attendee[];
}

export interface ConfirmationFormProps {
  numPeople: number;
  onSubmit: SubmitHandler<FormData>;
}
