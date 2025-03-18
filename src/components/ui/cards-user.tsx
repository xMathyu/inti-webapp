"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Visit {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  frequency: string;
  features: string[];
  active: boolean;
}

interface CardsUserProps {
  columns?: number; // Opción para definir el número de columnas
}

const CardsUser: React.FC<CardsUserProps> = ({ columns = 3 }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const router = useRouter();

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

  // Mapeo de número de columnas dinámico
  const gridColumns: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Grid dinámico */}
        <div className={`grid ${gridColumns[columns]} gap-6`}>
          {visits.map((visit) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-white shadow-lg border border-gray-200 flex flex-col h-full rounded-lg overflow-hidden">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {visit.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-500 mt-2">
                    {visit.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 flex-1">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    €{visit.price}
                    <span className="ml-1 text-base font-normal text-gray-400">
                      {visit.frequency}
                    </span>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {visit.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600 leading-relaxed">
                        <Check className="text-green-500 mr-2 mt-1" size={18} />
                        <span className="text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    className="bg-green-600 hover:bg-green-700 w-full text-white text-lg"
                    onClick={() => router.push(`/reservations?type=${encodeURIComponent(visit.id)}`)}
                  >
                    Prenota
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardsUser;
