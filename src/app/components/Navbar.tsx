"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Función de ayuda para efectuar un scroll suave hacia una sección dado su id.
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
      className="h-16 shadow-md bg-gradient-to-r from-green-700 to-green-600 relative"
    >
      {/* Contenedor para el contenido con padding solo a la derecha en móvil */}
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between pl-0 pr-4 md:px-8">
        {/* Logo: En móvil estará pegado a la izquierda */}
        <button
          onClick={() => scrollToSection("hero")}
          className="h-full flex items-center focus:outline-none"
        >
          <div className="relative h-full w-32">
            <Image
              src="/logos/logos_pequeno.svg"
              alt="Logo Parco dei Colori"
              fill
              style={{ objectFit: "contain", padding: "0.2rem" }}
            />
          </div>
        </button>

        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-green-500/20"
            onClick={() => scrollToSection("hero")}
          >
            Inizio
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-green-500/20"
            onClick={() => scrollToSection("about")}
          >
            Chi siamo
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-green-500/20"
            onClick={() => scrollToSection("gallery")}
          >
            Galleria
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-green-500/20"
            onClick={() => scrollToSection("guides")}
          >
            Guide
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-green-500/20"
            onClick={() => scrollToSection("tariffe")}
          >
            Tariffe
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-green-500/20"
            onClick={() => scrollToSection("contact")}
          >
            Contatti
          </Button>
        </div>

        {/* Botón Hamburger (visible en móvil) */}
        <button
          className="md:hidden focus:outline-none text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Menú Mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 z-50"
        >
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("hero");
              setIsMobileMenuOpen(false);
            }}
          >
            Inizio
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("about");
              setIsMobileMenuOpen(false);
            }}
          >
            Chi siamo
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("gallery");
              setIsMobileMenuOpen(false);
            }}
          >
            Galleria
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("guides");
              setIsMobileMenuOpen(false);
            }}
          >
            Guide
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("tariffe");
              setIsMobileMenuOpen(false);
            }}
          >
            Tariffe
          </Button>
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50"
            onClick={() => {
              scrollToSection("contact");
              setIsMobileMenuOpen(false);
            }}
          >
            Contatti
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
}
