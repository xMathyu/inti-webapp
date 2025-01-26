// app/components/Guides.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface Guide {
  name: string;
  specialty: string;
  image: string;
}

interface VisitType {
  name: string;
  price: number;
  description: string;
}

const guides: Guide[] = [
  {
    name: "Valentina",
    specialty: "Arqueología",
    image: "/valentina.jpg",
  },
  {
    name: "Lorenzo",
    specialty: "Fauna y Flora",
    image: "/lorenzo.jpg",
  },
];

const visits: VisitType[] = [
  {
    name: "Visita Arqueológica",
    price: 50,
    description: "Recorrido por los principales sitios arqueológicos.",
  },
  {
    name: "Visita Ecológica",
    price: 40,
    description: "Exploración de la flora y fauna local.",
  },
];

export function Guides() {
  return (
    <section id="guides" className="py-20 bg-[url('/domo.jpg')] bg-cover bg-center relative">
      {/* Overlay semi-transparente */}
      <div className="absolute inset-0 bg-white bg-opacity-70" />

      <div className="relative max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-semibold text-center text-green-800 mb-8"
        >
          Nuestros Guías
        </motion.h2>

        {/* Guías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guides.map((guide, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                className="
                  backdrop-blur-md 
                  bg-white/40 
                  shadow-lg 
                  border border-white/30
                "
              >
                <CardHeader className="flex items-center space-x-4">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-xl text-green-800">
                      {guide.name}
                    </CardTitle>
                    <CardDescription className="font-semibold">
                      {guide.specialty}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">
                    Guía experto en recorridos especializados.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tarifas */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold text-center text-green-800 mb-8"
        >
          Tipos de Visita y Tarifas
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visits.map((visit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                className="
                  backdrop-blur-md 
                  bg-white/40 
                  shadow-lg 
                  border border-white/30
                  flex flex-col
                "
              >
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">
                    {visit.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-700 mb-2">{visit.description}</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${visit.price}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-green-600 hover:bg-green-700 w-full">
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
