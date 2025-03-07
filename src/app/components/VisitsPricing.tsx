"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
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
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

const db = getFirestore();

export function VisitsPricing() {
  const { width } = useWindowSize();
  const router = useRouter();

  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(314);
  const [arrowSize, setArrowSize] = useState(24);
  const [gap, setGap] = useState(32);
  const [currentSlide, setCurrentSlide] = useState(0);

  interface Visit {
    id: string;
    name: string;
    shortDescription: string;
    price: number;
    frequency: string;
    features: string[];
    active: boolean;
  }
  const [visits, setVisits] = useState<Visit[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (width < 768) {
      setVisibleCards(1);
      setArrowSize(16);
      setGap(16);
      setCardWidth(width - 120);
    } else {
      setVisibleCards(3);
      setArrowSize(24);
      setGap(32);
      setCardWidth(314);
    }
  }, [width]);

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "visitTypes"));
        const data: Visit[] = [];
        querySnapshot.forEach((docSnap) => {
          const visit = docSnap.data() as Omit<Visit, "id">;
          data.push({
            id: docSnap.id,
            ...visit,
          });
        });
        setVisits(data);
      } catch (error) {
        console.error("Error al cargar los tipos de visita:", error);
      }
      setLoading(false);
    };
    fetchVisits();
  }, []);

  const activeVisits = visits.filter((visit) => visit.active);

  const totalCards = activeVisits.length;
  const visibleWidth = visibleCards * cardWidth + (visibleCards - 1) * gap;
  const maxSlide = totalCards - visibleCards;

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });

  return (
    <section id="tariffe" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-green-800 mb-12"
        >
          Tipi di Visita e Tariffe
        </motion.h2>
        <div className="flex items-center justify-center">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="mr-4 bg-white rounded-full shadow p-1 hover:bg-green-100 disabled:opacity-50"
          >
            <ChevronLeft size={arrowSize} className="text-green-600" />
          </button>
          <div
            className="overflow-hidden"
            style={{ width: visibleWidth }}
            {...swipeHandlers}
          >
            <div
              style={{
                transform: `translateX(-${currentSlide * (cardWidth + gap)}px)`,
                transition: "transform 0.5s ease",
              }}
              className="flex"
            >
              {activeVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex-shrink-0"
                  style={{
                    width: cardWidth,
                    marginRight:
                      visit.id === activeVisits[activeVisits.length - 1].id
                        ? 0
                        : gap,
                  }}
                >
                  <Card className="bg-white shadow-lg border border-gray-200 flex flex-col rounded-lg overflow-hidden">
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
                        {visit.features.map((feature: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start text-gray-600 leading-relaxed"
                          >
                            <Check
                              className="text-green-500 mr-2 mt-1"
                              size={18}
                            />
                            <span className="text-sm md:text-base">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        className="bg-green-600 hover:bg-green-700 w-full text-white text-lg"
                        onClick={() =>
                          // Redirige a /reservations con el query param ?type=...
                          router.push(
                            `/reservations?type=${encodeURIComponent(visit.id)}`
                          )
                        }
                      >
                        Prenota
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={currentSlide === maxSlide}
            className="ml-4 bg-white rounded-full shadow p-1 hover:bg-green-100 disabled:opacity-50"
          >
            <ChevronRight size={arrowSize} className="text-green-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
