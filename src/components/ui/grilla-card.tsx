"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import CardItem from "./card-item";
import { VisitOrder } from "@/app/interfaces/interfaces";

interface GrillaCardProps {
  showButton?: boolean;
  isAdmin?: boolean;
  onVisitsChange?: (visits: VisitOrder[]) => void;
}

export default function GrillaCard({
  showButton = true,
  isAdmin = false,
  onVisitsChange,
}: GrillaCardProps) {
  const [visits, setVisits] = useState<VisitOrder[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const data: VisitOrder[] = [];
        querySnapshot.forEach((docSnap) => {
          const visit = docSnap.data() as Omit<VisitOrder, "id">;
          data.push({ id: docSnap.id, ...visit });
        });
        const activeVisits = data.filter((visit) => visit.active);
        activeVisits.sort((a, b) => parseInt(a.order) - parseInt(b.order));
        setVisits(activeVisits);
        if (onVisitsChange) {
          onVisitsChange(activeVisits);
        }
      } catch (error) {
        console.error(
          "Errore durante il caricamento dei tipi di visita:",
          error
        );
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-screen-xl mx-auto">
      {visits.map((visit, index) => (
        <div
          key={visit.id}
          draggable={isAdmin && !isModalOpen}
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
          style={{
            opacity: draggedItemIndex === index ? 0.5 : 1,
            maxWidth: "384px",
            width: "100%",
          }}
        >
          <CardItem
            visit={visit}
            showButton={showButton}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      ))}
    </div>
  );
}
