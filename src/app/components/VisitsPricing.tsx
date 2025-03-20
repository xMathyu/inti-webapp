"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import CardItem from "@/components/ui/card-item";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export function VisitsPricing() {
  const router = useRouter();
  const { width } = useWindowSize();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Cantidad de cards visibles en desktop vs móvil
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    if (width < 768) {
      setVisibleCards(1);
    } else {
      setVisibleCards(3);
    }
  }, [width]);

  // Cargar visitas (solo las primeras 3 + "Ver más")
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
        setVisits(activeVisits.slice(0, 4)); 
      } catch (error) {
        console.error("Error al cargar los tipos de visita:", error);
      }
    };
    fetchVisits();
  }, []);

  // Total de "cards" = 3 visitas + 1 “Ver más” (si hay al menos 3)
  const totalCards = visits.length >= 3 ? 4 : visits.length;
  const maxSlide = totalCards - visibleCards;

  // Handlers para swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((prev) => Math.min(prev + 1, maxSlide)),
    onSwipedRight: () => setCurrentSlide((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  const goPrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));

  return (
    <section id="tariffe" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-green-800 mb-12">
          Tipi di Visita e Tariffe
        </h2>
        <div className="relative flex items-center justify-center" {...swipeHandlers}>
          {/* Botón flecha izquierda */}
          <button
            onClick={goPrev}
            className="absolute left-0 p-2 bg-white rounded-full shadow-md"
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={24} className="text-green-600" />
          </button>

          {/* Carrusel */}
          <div className="overflow-hidden w-full max-w-screen-lg">
            <motion.div
              className="flex"
              animate={{
                translateX: `-${(currentSlide * 100) / visibleCards}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Render de las primeras 3 visitas */}
              {visits.slice(0, 3).map((visit) => (
                <div key={visit.id} className="flex-shrink-0 w-full md:w-1/3 px-2">
                  <CardItem
                    visit={visit}
                    showButton={true}
                    setIsModalOpen={() => {}}
                  />
                </div>
              ))}

              {/* 4ta tarjeta: "Ver más", con el mismo diseño que las otras */}
              {visits.length >= 3 && (
                <div className="flex-shrink-0 w-full md:w-1/3 px-2">
                  <Card className="bg-white shadow-lg border border-gray-200 flex flex-col h-full rounded-lg overflow-hidden">
                    <CardHeader className="p-6 pb-3">
                      {/* Aquí agregas el texto personalizado */}
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        Conoce más de nuestros planes
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-500 mt-2">
                        Descubre todas las opciones y tarifas disponibles.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 flex-1">
                      {/* Opcional: texto adicional, bullets, etc. */}
                      <p className="text-gray-600 leading-relaxed">
                        Tenemos diferentes experiencias y actividades para grupos y familias.
                      </p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        className="bg-green-600 hover:bg-green-700 w-full text-white text-lg"
                        onClick={() => router.push("/visits-prices")}
                      >
                        Ver más
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>

          {/* Botón flecha derecha */}
          <button
            onClick={goNext}
            className="absolute right-0 p-2 bg-white rounded-full shadow-md"
            disabled={currentSlide >= maxSlide || maxSlide < 0}
          >
            <ChevronRight size={24} className="text-green-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
