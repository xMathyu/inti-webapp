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
}

export default function GrillaCard() {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const data: Visit[] = [];
        querySnapshot.forEach((docSnap) => {
          const visit = docSnap.data() as Omit<Visit, "id">;
          data.push({ id: docSnap.id, ...visit });
        });
        setVisits(data.filter((visit) => visit.active));
      } catch (error) {
        console.error("Error al cargar los tipos de visita:", error);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {visits.map((visit) => (
        <CardItem key={visit.id} visit={visit} />
      ))}
    </div>
  );
}
