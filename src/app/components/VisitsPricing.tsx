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

// Hook para obtener dimensiones de la ventana
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

// Datos de visitas y tarifas
const visits = [
  {
    name: "Visita guidata",
    price: 10,
    frequency: "per visita",
    shortDescription: "Esperienza completa con video e degustazione di tè.",
    features: [
      "Introduzione con video proiezione del ciclo vitale delle farfalle",
      "Visita del parco",
      "Visita dell'allevamento di bruchi e di farfalle",
      "Inclusa una tazza di tè caldo/freddo",
      "Tempo: 2 ore",
    ],
  },
  {
    name: "Visita guidata con laboratorio",
    price: 20,
    frequency: "per visita",
    shortDescription: "Visita con laboratorio creativo e educativo.",
    features: [
      "Introduzione con video proiezione del ciclo vitale delle farfalle",
      "Visita del parco",
      "Visita dell'allevamento di bruchi e di farfalle",
      "Laboratorio di tessitura e creazione di mandala",
      "Laboratorio di cucina",
      "Laboratorio di tisaneria",
      "Laboratorio piante tintorie",
      "Laboratorio di semina",
      "Tempo: 4 ore",
      "Per info sulle dinamiche dei laboratori: ass.inticastelgrande@gmail.com",
    ],
  },
  {
    name: "Visita guidata + colazione",
    price: 15,
    frequency: "per visita",
    shortDescription: "Visita completa con colazione a scelta.",
    features: [
      "Introduzione con video proiezione del ciclo vitale delle farfalle",
      "Visita del parco",
      "Visita dell'allevamento di bruchi e di farfalle",
      "Colazione: opzione 1: pancake + caffè/succo/acqua; opzione 2: club sandwich/pizza + caffè/succo/acqua",
    ],
  },
  {
    name: "Visita guidata + pranzo",
    price: 25,
    frequency: "per visita",
    shortDescription: "Visita completa con pranzo a base di prodotti locali.",
    features: [
      "Introduzione con video proiezione del ciclo vitale delle farfalle",
      "Visita del parco",
      "Visita dell'allevamento di bruchi e di farfalle",
      "Pranzo con alimenti stagionali dell'orto, prodotti da aziende agricole lucane",
      "Contattare: ass.inticastelgrande@gmail.com per definire il menù",
    ],
  },
  {
    name: "Visita guidata + laboratorio + pranzo",
    price: 30,
    frequency: "per visita",
    shortDescription:
      "Visita completa con laboratorio a scelta e pranzo locale.",
    features: [
      "Introduzione con video proiezione del ciclo vitale delle farfalle",
      "Visita del parco",
      "Visita dell'allevamento di bruchi e di farfalle",
      "Laboratorio a scelta",
      "Pranzo con alimenti stagionali dell'orto, prodotti da aziende agricole lucane",
      "Contattare: ass.inticastelgrande@gmail.com per definire il menù",
    ],
  },
  {
    name: "Visita guidata + degustazione tè e tisane",
    price: 12,
    frequency: "per visita",
    shortDescription: "Visita completa con degustazione di tè e tisane.",
    features: [
      "Introduzione con video proiezione del ciclo vitale delle farfalle",
      "Visita del parco",
      "Visita dell'allevamento di bruchi e di farfalle",
    ],
  },
];

export function VisitsPricing() {
  const { width } = useWindowSize();
  const router = useRouter();

  // Estados para adaptar el diseño según el ancho de la ventana
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(314);
  const [arrowSize, setArrowSize] = useState(24);
  const [gap, setGap] = useState(32);

  useEffect(() => {
    if (width < 768) {
      setVisibleCards(1);
      setArrowSize(16);
      setGap(16);
      // Ajusta el ancho de la tarjeta para que se muestre completa en mobile,
      // restando el espacio necesario para las flechas (por ejemplo, 120px)
      setCardWidth(width - 120);
    } else {
      setVisibleCards(3);
      setArrowSize(24);
      setGap(32);
      setCardWidth(314);
    }
  }, [width]);

  const totalCards = visits.length;
  const visibleWidth = visibleCards * cardWidth + (visibleCards - 1) * gap;
  const maxSlide = totalCards - visibleCards;
  const [currentSlide, setCurrentSlide] = useState(0);

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
              {visits.map((visit, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0"
                  style={{
                    width: cardWidth,
                    marginRight: idx === totalCards - 1 ? 0 : gap,
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
                        {visit.features.map((feature, fidx) => (
                          <li
                            key={fidx}
                            className="flex items-start text-gray-600 leading-relaxed"
                          >
                            <Check
                              className="text-green-500 mr-2 mt-1"
                              size={18}
                            />
                            <span
                              className="text-sm md:text-base"
                              style={{ textAlign: "justify" }}
                            >
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
                          // Redirige a la página de reserva, pasando el nombre del tipo de visita
                          router.push(
                            `/reservations/${encodeURIComponent(visit.name)}`
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
