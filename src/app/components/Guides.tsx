"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Datos de los guías
const guides = [
  {
    name: "Valentina",
    specialty: "Arqueología",
    image: "/valentina.jpg",
    bio: "Apasionada de la historia y la arqueología. Ha liderado expediciones únicas, compartiendo descubrimientos inolvidables.",
  },
  {
    name: "Lorenzo",
    specialty: "Fauna y Flora",
    image: "/lorenzo.jpg",
    bio: "Especialista en botánica y observación de mariposas. Comparte curiosidades y consejos de conservación en cada ruta.",
  },
];

export function Guides() {
  return (
    <section
      id="guides"
      className="relative py-20 overflow-hidden bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Ola superior */}
      <div className="pointer-events-none absolute top-0 left-0 w-full -translate-y-full z-[1]">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M0,224L80,202.7C160,181,320,139,480,133.3C640,128,800,160,960,186.7C1120,213,1280,235,1360,245.3L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Ola inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full translate-y-full rotate-180 z-[1]">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M0,224L80,202.7C160,181,320,139,480,133.3C640,128,800,160,960,186.7C1120,213,1280,235,1360,245.3L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Contenedor principal */}
      <div className="relative max-w-6xl mx-auto px-4 z-10">
        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-green-800 mb-12"
        >
          Nuestros Guías
        </motion.h2>

        {/* Grid de Guías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map((guide, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="transform transition-transform hover:-translate-y-2"
            >
              <Card className="shadow-md border border-gray-200 rounded-lg overflow-hidden bg-white">
                {/* Imagen del guía (más grande y redonda) */}
                <div className="flex justify-center mt-6">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="
                      w-32 
                      h-32 
                      sm:w-36 
                      sm:h-36 
                      rounded-full 
                      object-cover 
                      ring-4 
                      ring-white 
                      ring-offset-4 
                      ring-offset-green-100
                      transition-transform
                      hover:scale-105
                    "
                  />
                </div>

                {/* Cabecera del Card */}
                <CardHeader className="pt-4 pb-2 text-center">
                  <CardTitle className="text-2xl text-green-800 font-bold">
                    {guide.name}
                  </CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    {guide.specialty}
                  </CardDescription>
                </CardHeader>

                {/* Contenido: bio */}
                <CardContent className="px-6 pb-6 text-center">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {guide.bio}
                  </p>
                </CardContent>

                {/* Footer (Opcional): botón o links */}
                <CardFooter className="flex justify-center pb-6">
                  <button
                    className="
                      bg-green-600 
                      hover:bg-green-700
                      text-white
                      font-semibold
                      py-2 
                      px-6 
                      rounded
                      shadow
                      transition-colors
                    "
                    onClick={() => alert(`Conoce más sobre ${guide.name}`)}
                  >
                    Conoce Más
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
