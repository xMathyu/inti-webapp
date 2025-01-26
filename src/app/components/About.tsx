// app/components/About.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Wave superior */}
      <div className="pointer-events-none absolute top-0 left-0 w-full -translate-y-full">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L80,197.3C160,171,320,117,480,106.7C640,96,800,128,960,154.7C1120,181,1280,203,1360,213.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Wave inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full translate-y-full rotate-180">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L80,197.3C160,171,320,117,480,106.7C640,96,800,128,960,154.7C1120,181,1280,203,1360,213.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Contenedor principal */}
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div
          className="
            backdrop-blur-md 
            bg-white/60
            shadow-xl
            rounded-xl
            p-8
            md:p-12
          "
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-semibold text-green-800 mb-6 text-center">
            Acerca de INTI
          </h2>

          {/* Badge o dato destacado */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-green-200 text-green-800">
              Más de 10,000 visitantes satisfechos
            </Badge>
          </div>

          {/* Contenido principal: imagen + texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Imagen / ilustración */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src="/about.jpg"
                alt="Imagen de INTI"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </motion.div>

            {/* Texto */}
            <motion.div
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                En <span className="font-bold text-green-800">Asociación INTI </span> 
                nos dedicamos a promover el cuidado y la apreciación de la flora y fauna local, 
                con un enfoque especial en nuestros hermosos jardines y mariposas. 
                Nuestro equipo de guías expertos se esfuerza por brindar experiencias 
                inolvidables a visitantes de todo el mundo.
              </p>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                Creemos en la importancia de la educación ambiental y la conservación, 
                por lo que cada recorrido incluye información detallada y consejos 
                para proteger nuestros recursos naturales.
              </p>

              <div>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // lógica opcional: redirigir a otra página, etc.
                    alert("¡Gracias por tu interés en INTI!");
                  }}
                >
                  Conoce Más
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
