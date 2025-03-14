"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import VisitTypeCard, { VisitType } from "@/app/components/admin/VisitTypeCard";
import VisitTypeForm, {
  VisitTypeFormData,
} from "@/app/components/admin/VisitTypeForm";
import { toast } from "sonner";
import { db } from "@/app/lib/firebase";

export default function AdminVisitTypesPanel() {
  const [visitTypes, setVisitTypes] = useState<VisitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitType | null>(null);

  // Carga inicial (solo una vez)
  const fetchVisitTypes = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "visitTypes"));
      const types: VisitType[] = [];
      querySnapshot.forEach((docSnap) => {
        types.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<VisitType, "id">),
        });
      });
      setVisitTypes(types);
    } catch {
      toast.error("Error al cargar los tipos de visita.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVisitTypes();
  }, [fetchVisitTypes]);

  const handleSave = async (data: VisitTypeFormData) => {
    try {
      const docId = selectedVisit ? selectedVisit.id : data.name;
      await setDoc(doc(db, "visitTypes", docId), { ...data }, { merge: true });
      toast.success("Tipo de visita guardado con éxito.");
      setModalOpen(false);
      // Actualiza el estado local sin recargar todos los datos:
      setVisitTypes((prev) => {
        const newItem = { id: docId, ...data };
        if (selectedVisit) {
          // Actualizar el elemento existente
          return prev.map((item) =>
            item.id === selectedVisit.id ? newItem : item
          );
        } else {
          // Agregar el nuevo elemento (al inicio)
          return [newItem, ...prev];
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error inesperado.");
      } else {
        toast.error("Error inesperado.");
      }
    }
  };

  const handleDelete = async (visit: VisitType) => {
    try {
      await deleteDoc(doc(db, "visitTypes", visit.id));
      toast.success("Tipo de visita eliminado.");
      // Eliminar el elemento del estado local
      setVisitTypes((prev) => prev.filter((item) => item.id !== visit.id));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inesperado.";
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (visit: VisitType) => {
    try {
      const newStatus = !visit.active;
      await setDoc(
        doc(db, "visitTypes", visit.id),
        { active: newStatus },
        { merge: true }
      );
      // Actualiza el estado local para ese elemento sin mostrar toast
      setVisitTypes((prev) =>
        prev.map((item) =>
          item.id === visit.id ? { ...item, active: newStatus } : item
        )
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inesperado.";
      toast.error(errorMessage);
    }
  };

  const openModalForNew = () => {
    setSelectedVisit(null);
    setModalOpen(true);
  };

  const openModalForEdit = (visit: VisitType) => {
    setSelectedVisit(visit);
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow relative">
      {/* Cabecera con título único y botón a la derecha */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">
          Panel de Administración de Tipos de Visita
        </h1>
        <Button
          onClick={openModalForNew}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus size={20} />
        </Button>
      </div>

      <VisitTypeForm
        initialData={
          selectedVisit
            ? {
                name: selectedVisit.name,
                price: selectedVisit.price,
                frequency: selectedVisit.frequency,
                shortDescription: selectedVisit.shortDescription,
                features: selectedVisit.features,
                active: selectedVisit.active,
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
          {visitTypes.map((visit) => (
            <VisitTypeCard
              key={visit.id}
              visit={visit}
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
