"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Consultar Firestore para obtener el rol del usuario
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === "admin"); // Solo será true si el usuario es admin
        }
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/#hero" className="flex items-center">
          <Image
            src="/logos/logos_pequeno.svg"
            alt="Logo Parco dei Colori"
            width={120}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link href="/#hero" className="hover:text-gray-300">Inizio</Link>
          <Link href="/#about" className="hover:text-gray-300">Chi siamo</Link>
          <Link href="/#gallery" className="hover:text-gray-300">Galleria</Link>
          <Link href="/#guides" className="hover:text-gray-300">Guide</Link>
          <Link href="/#tariffe" className="hover:text-gray-300">Tariffe</Link>
          <Link href="/#contact" className="hover:text-gray-300">Contatti</Link>

          {/* Menú de usuario */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-green-500/20">
                  {user.displayName ? `Ciao, ${user.displayName}` : "Il tuo account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg rounded-md py-2 w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Il mio account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-entries" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Le mie voci
                  </Link>
                </DropdownMenuItem>

                {/* Opciones de Admin */}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/schedules" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Admin - Schedules
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/visit-types" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Admin - Visit Types
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem asChild>
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100">
                    Esci
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-green-500/20">
              <Link href="/auth">Accedi / Registrati</Link>
            </Button>
          )}
        </div>

        {/* Botón menú mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
          <Link href="/#hero" className="text-green-700 hover:bg-green-50">Inizio</Link>
          <Link href="/#about" className="text-green-700 hover:bg-green-50">Chi siamo</Link>
          <Link href="/#gallery" className="text-green-700 hover:bg-green-50">Galleria</Link>
          <Link href="/#guides" className="text-green-700 hover:bg-green-50">Guide</Link>
          <Link href="/#tariffe" className="text-green-700 hover:bg-green-50">Tariffe</Link>
          <Link href="/#contact" className="text-green-700 hover:bg-green-50">Contatti</Link>

          {/* Opciones para usuarios autenticados */}
          {user ? (
            <>
              <Link href="/account" className="text-green-700 hover:bg-green-50">Il mio account</Link>
              {isAdmin && (
                <>
                  <Link href="/admin/schedules" className="text-green-700 hover:bg-green-50">Admin - Schedules</Link>
                  <Link href="/admin/visit-types" className="text-green-700 hover:bg-green-50">Admin - Visit Types</Link>
                </>
              )}
              <button onClick={handleSignOut} className="text-red-600 hover:bg-red-100 px-4 py-2">
                Esci
              </button>
            </>
          ) : (
            <Link href="/auth" className="text-green-700 hover:bg-green-50">Accedi / Registrati</Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
