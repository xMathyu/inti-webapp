"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface VisitType {
  id: string;
  name: string;
  price: number;
  frequency: string;
  shortDescription: string;
  features: string[];
  active: boolean;
}

interface VisitTypeCardProps {
  visit: VisitType;
  onEdit: (visit: VisitType) => void;
  onDelete: (visit: VisitType) => void;
  onToggleActive: (visit: VisitType) => void;
}

export default function VisitTypeCard({
  visit,
  onEdit,
  onDelete,
  onToggleActive,
}: VisitTypeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="mb-3">
        <h3 className="text-2xl font-bold text-green-800">{visit.name}</h3>
        <p className="text-green-700 font-medium">
          €{visit.price}{" "}
          <span className="text-sm font-normal">- {visit.frequency}</span>
        </p>
      </div>
      <p className="text-gray-600 mb-3">{visit.shortDescription}</p>
      <ul className="list-disc pl-5 space-y-1 mb-4 text-gray-600">
        {visit.features.map((feat, idx) => (
          <li key={idx}>{feat}</li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id={`switch-${visit.id}`}
            checked={visit.active}
            onCheckedChange={() => onToggleActive(visit)}
          />
          <span className="text-sm font-medium text-green-800">
            {visit.active ? "Activo" : "Inactivo"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => onEdit(visit)}>
            Editar
          </Button>
          <Button variant="destructive" onClick={() => onDelete(visit)}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
