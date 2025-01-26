"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Función de ayuda que hace scroll suave hasta una sección dada su id.
 */
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-green-700 to-green-600"
    >
      {/* Logo Texto */}
      <button
        onClick={() => scrollToSection("hero")}
        className="flex items-center focus:outline-none"
      >
        <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          INTI
        </span>
      </button>

      {/* Menú Desktop */}
      <div className="hidden md:flex space-x-4">
        <Button
          variant="ghost"
          className="text-white hover:bg-green-500/20"
          onClick={() => scrollToSection("hero")}
        >
          Inicio
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-green-500/20"
          onClick={() => scrollToSection("gallery")}
        >
          Galería
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-green-500/20"
          onClick={() => scrollToSection("guides")}
        >
          Guías
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-green-500/20"
          onClick={() => scrollToSection("contact")}
        >
          Contacto
        </Button>
      </div>

      {/* Botón Hamburguesa */}
      <button
        className="md:hidden focus:outline-none text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-50"
        >
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("hero");
              setIsMobileMenuOpen(false);
            }}
          >
            Inicio
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("gallery");
              setIsMobileMenuOpen(false);
            }}
          >
            Galería
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("guides");
              setIsMobileMenuOpen(false);
            }}
          >
            Guías
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("contact");
              setIsMobileMenuOpen(false);
            }}
          >
            Contacto
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
}
