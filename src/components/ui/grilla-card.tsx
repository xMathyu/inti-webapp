"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import CardItem from "./card-item";

interface Visit {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  frequency: string;
  features: string[];
  active: boolean;
  order: string;
}

interface GrillaCardProps {
  showButton?: boolean;
  isAdmin?: boolean;
  onVisitsChange?: (visits: Visit[]) => void;
}

export default function GrillaCard({
  showButton = true,
  isAdmin = false,
  onVisitsChange,
}: GrillaCardProps) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const data: Visit[] = [];
        querySnapshot.forEach((docSnap) => {
          const visit = docSnap.data() as Omit<Visit, "id">;
          data.push({ id: docSnap.id, ...visit });
        });
        const activeVisits = data.filter((visit) => visit.active);
        activeVisits.sort((a, b) => parseInt(a.order) - parseInt(b.order));
        setVisits(activeVisits);
        if (onVisitsChange) {
          onVisitsChange(activeVisits);
        }
      } catch (error) {
        console.error("Error al cargar los tipos de visita:", error);
      }
    };
    fetchVisits();
  }, [onVisitsChange]);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    setDragOverItemIndex(index);
    const items = Array.from(visits);
    const [draggedItem] = items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);
    setVisits(items);
    setDraggedItemIndex(index);
    if (onVisitsChange) {
      onVisitsChange(items);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedItemIndex === null) return;
    handleDragOver(index);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {visits.map((visit, index) => (
        <div
          key={visit.id}
          draggable={isAdmin}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOver(index);
          }}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={`cursor-move ${
            dragOverItemIndex === index ? "border-2 border-blue-500" : ""
          }`}
          style={{ opacity: draggedItemIndex === index ? 0.5 : 1 }}
        >
          <CardItem visit={visit} showButton={showButton} />
        </div>
      ))}
    </div>
  );
}
