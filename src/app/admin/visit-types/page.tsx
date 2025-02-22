"use client";

import { useState, useEffect } from "react";
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
import VisitTypeCard, { VisitType } from "@/app/components/admin/VisitTypeCard";
import VisitTypeForm, {
  VisitTypeFormData,
} from "@/app/components/admin/VisitTypeForm";

const db = getFirestore();

export default function AdminVisitTypesPanel() {
  const [visitTypes, setVisitTypes] = useState<VisitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitType | null>(null);

  const fetchVisitTypes = async () => {
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
      setError("Error al cargar los tipos de visita.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVisitTypes();
  }, []);

  const handleSave = async (data: VisitTypeFormData) => {
    try {
      const docId = selectedVisit ? selectedVisit.id : data.name;
      await setDoc(doc(db, "visitTypes", docId), { ...data }, { merge: true });
      setMessage("Tipo de visita guardado con éxito.");
      setModalOpen(false);
      fetchVisitTypes();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error inesperado.");
      } else {
        setError("Error inesperado.");
      }
    }
  };

  const handleDelete = async (visit: VisitType) => {
    try {
      await deleteDoc(doc(db, "visitTypes", visit.id));
      setMessage("Tipo de visita eliminado.");
      fetchVisitTypes();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error inesperado.");
      } else {
        setError("Error inesperado.");
      }
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
      setMessage(`Tipo de visita ${newStatus ? "activado" : "desactivado"}.`);
      fetchVisitTypes();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error inesperado.");
      } else {
        setError("Error inesperado.");
      }
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
    <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow">
      <h1 className="text-2xl font-bold text-green-800 mb-4">
        Panel de Administración de Tipos de Visita
      </h1>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}

      {/* Botón circular para agregar nuevo */}
      <div className="mb-4 flex justify-end">
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

      <h2 className="text-xl font-semibold text-green-800 mb-4">
        Tipos de Visita Existentes
      </h2>

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
