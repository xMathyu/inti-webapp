"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center h-[90vh] overflow-hidden"
    >
      {/* Imagen de fondo con Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/domo.jpg')`,
        }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </motion.div>

      {/* Contenido */}
      <div className="relative z-10 px-4 text-center text-white max-w-2xl flex flex-col items-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold drop-shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background:
              "linear-gradient(to right, #ffffff, #b2f5ea)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Asociación Inti
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mt-4 drop-shadow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Explora jardines, mariposas y plantas con nuestras visitas guiadas.
        </motion.p>
        <motion.div
          className="mt-8 flex space-x-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Button className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 border-none">
            Reservar Ahora
          </Button>
          <Button
            variant="outline"
            className="
            px-6 
            py-3 
            text-lg 
            font-semibold 
            text-white 
            border-white
            bg-transparent 
            hover:bg-white 
            hover:text-green-700
          "          >
            Comprar Entradas
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
