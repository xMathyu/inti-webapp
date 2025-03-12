"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-16 shadow-md bg-gradient-to-r from-green-700 to-green-600 relative"
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between pl-0 pr-4 md:px-8">
        {/* Logo: Siempre redirige al Home con ancla "#hero" */}
        <Link
          href="/#hero"
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
        </Link>

        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/#hero" className="text-white hover:bg-green-500/20">
            Inizio
          </Link>
          <Link href="/#about" className="text-white hover:bg-green-500/20">
            Chi siamo
          </Link>
          <Link href="/#gallery" className="text-white hover:bg-green-500/20">
            Galleria
          </Link>
          <Link href="/#guides" className="text-white hover:bg-green-500/20">
            Guide
          </Link>
          <Link href="/#tariffe" className="text-white hover:bg-green-500/20">
            Tariffe
          </Link>
          <Link href="/#contact" className="text-white hover:bg-green-500/20">
            Contatti
          </Link>
          {user ? (
            <div ref={dropdownContainerRef} className="relative">
              <Button
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-green-500/20"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.displayName
                  ? `Ciao, ${user.displayName}`
                  : "Il tuo account"}
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Il mio account
                  </Link>
                  <Link
                    href="/my-entries"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Le mie voci
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600"
                  >
                    Esci
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-green-500/20"
              asChild
            >
              <Link href="/auth">Accedi / Registrati</Link>
            </Button>
          )}
        </div>

        {/* Botón Hamburger (Mobile) */}
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
          <Link
            href="/#hero"
            className="text-green-700 hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Inizio
          </Link>
          <Link
            href="/#about"
            className="text-green-700 hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Chi siamo
          </Link>
          <Link
            href="/#gallery"
            className="text-green-700 hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Galleria
          </Link>
          <Link
            href="/#guides"
            className="text-green-700 hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Guide
          </Link>
          <Link
            href="/#tariffe"
            className="text-green-700 hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tariffe
          </Link>
          <Link
            href="/#contact"
            className="text-green-700 hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contatti
          </Link>
          {user ? (
            <div
              ref={dropdownContainerRef}
              className="w-full flex flex-col items-center"
            >
              <Button
                variant="outline"
                className="bg-transparent text-green-700 border-green-700 hover:bg-green-50 w-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.displayName
                  ? `Ciao, ${user.displayName}`
                  : "Il tuo account"}
              </Button>
              {isDropdownOpen && (
                <div className="w-full bg-white shadow-lg rounded-md py-2 z-50">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Il mio account
                  </Link>
                  <Link
                    href="/my-entries"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Le mie voci
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600"
                  >
                    Esci
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="bg-transparent text-green-700 border-green-700 hover:bg-green-50"
              onClick={() => setIsMobileMenuOpen(false)}
              asChild
            >
              <Link href="/auth">Accedi / Registrati</Link>
            </Button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
