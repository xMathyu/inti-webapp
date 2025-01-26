// app/components/Footer.tsx
"use client";

import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-12 bg-gradient-to-r from-green-600 to-green-700 text-white">
      {/* Ola SVG arriba */}
      <div className="absolute top-0 left-0 w-full h-auto -translate-y-full pointer-events-none">
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

      {/* Contenido del footer */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-8 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">

        {/* Logo / Nombre */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">INTI</h2>
          <p className="text-sm">Asociación de Jardines y Mariposas</p>
        </div>

        {/* Redes Sociales */}
        <div className="flex space-x-6 text-white">
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-green-200 transition-colors"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-green-200 transition-colors"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>

      {/* Línea divisoria opcional */}
      <div className="border-t border-green-500/50 mx-6" />

      {/* Derechos reservados */}
      <div className="relative z-10 py-4 text-center text-sm">
        <p>
          &copy; {currentYear} INTI. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
