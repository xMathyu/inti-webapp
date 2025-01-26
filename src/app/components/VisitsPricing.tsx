"use client";

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

// Datos de visitas y tarifas
const visits = [
  {
    name: "Visita Arqueológica",
    price: 50,
    frequency: "/visita",
    shortDescription: "Ideal para aficionados a la historia",
    features: [
      "Recorrido por sitios arqueológicos",
      "Guía experto en arqueología",
      "Grupos reducidos",
      "Incluye transporte local",
      "Duración: 3 horas",
    ],
  },
  {
    name: "Visita Ecológica",
    price: 40,
    frequency: "/visita",
    shortDescription: "Explora la flora y fauna local",
    features: [
      "Recorrido por áreas naturales",
      "Observación de mariposas",
      "Guía experto en biología",
      "Incluye bebidas refrescantes",
      "Duración: 2 horas",
    ],
  },
];

export function VisitsPricing() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-green-800 mb-12"
        >
          Tipos de Visita y Tarifas
        </motion.h2>

        {/* Grid de Tarifas - estilo Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visits.map((visit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="transform transition-transform hover:-translate-y-2"
            >
              <Card className="bg-white shadow-lg border border-gray-200 flex flex-col rounded-lg overflow-hidden">
                {/* Header: Nombre y subtítulo */}
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {visit.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-500 mt-2">
                    {visit.shortDescription}
                  </CardDescription>
                </CardHeader>

                {/* Contenido: Lista de bullet points y precio */}
                <CardContent className="px-6 flex-1">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    ${visit.price}
                    <span className="ml-1 text-base font-normal text-gray-400">
                      {visit.frequency}
                    </span>
                  </div>

                  {/* Lista de features con Check icon */}
                  <ul className="space-y-2 mt-4">
                    {visit.features.map((feature, fidx) => (
                      <li
                        key={fidx}
                        className="flex items-start text-gray-600 leading-relaxed"
                      >
                        <Check className="text-green-500 mr-2 mt-1" size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* Footer: Botón */}
                <CardFooter className="p-6 pt-0">
                  <Button className="bg-green-600 hover:bg-green-700 w-full text-white text-lg">
                    Reservar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
