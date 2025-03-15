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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  // 🔹 CIERRA EL DROPDOWN AL CAMBIAR A MOBILE 🔹
  useEffect(() => {
    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 768;
      setIsDesktop(isNowDesktop);
      if (!isNowDesktop) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    // Ejecutar handleResize una vez para establecer el estado inicial
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false); // Cerrar menú tras logout
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
        {/* Logo */}
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
        <div className="hidden md:flex items-center space-x-4 text-white">
          <Link href="/#hero" className="hover:bg-green-500/20">
            Inizio
          </Link>
          <Link href="/#about" className="hover:bg-green-500/20">
            Chi siamo
          </Link>
          <Link href="/#gallery" className="hover:bg-green-500/20">
            Galleria
          </Link>
          <Link href="/#guides" className="hover:bg-green-500/20">
            Guide
          </Link>
          <Link href="/#tariffe" className="hover:bg-green-500/20">
            Tariffe
          </Link>
          <Link href="/#contact" className="hover:bg-green-500/20">
            Contatti
          </Link>

          {/* Menú de usuario */}
          {user && isDesktop ? (
            <DropdownMenu
              modal={false}
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-green-500/20 cursor-pointer"
                >
                  {user.displayName
                    ? `Ciao, ${user.displayName}`
                    : "Il tuo account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white shadow-lg rounded-md py-2 w-48 data-[state=open]:animate-none"
                onClick={() => setIsDropdownOpen(false)}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Il mio account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/my-entries"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Le mie voci
                  </Link>
                </DropdownMenuItem>

                {/* Opciones de Admin */}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/schedules"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Admin - Schedules
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/visit-types"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Admin - Visit Types
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem asChild>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsDropdownOpen(false); // 🔹 Cierra el menú al cerrar sesión
                    }}
                    className="w-full text-left px-4 py-2 !text-white !bg-red-500 data-[highlighted]:!bg-red-600 cursor-pointer"
                  >
                    Esci
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-green-500/20"
            >
              <Link href="/auth">Accedi / Registrati</Link>
            </Button>
          )}
        </div>

        {/* Botón menú mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          <Link href="/#hero" className="text-green-700 hover:bg-green-50">
            Inizio
          </Link>
          <Link href="/#about" className="text-green-700 hover:bg-green-50">
            Chi siamo
          </Link>
          <Link href="/#gallery" className="text-green-700 hover:bg-green-50">
            Galleria
          </Link>
          <Link href="/#guides" className="text-green-700 hover:bg-green-50">
            Guide
          </Link>
          <Link href="/#tariffe" className="text-green-700 hover:bg-green-50">
            Tariffe
          </Link>
          <Link href="/#contact" className="text-green-700 hover:bg-green-50">
            Contatti
          </Link>

          {/* Menú desplegable de usuario en móvil */}
          {user ? (
            <>
              <Button
                variant="outline"
                className="bg-transparent text-green-700 border-green-700 hover:bg-green-50 w-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.displayName
                  ? `Ciao, ${user.displayName}`
                  : "Il tuo account"}
              </Button>
              {isDropdownOpen && (
                <div className="w-full bg-white shadow-lg rounded-md py-2 text-center">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Il mio account
                  </Link>
                  <Link
                    href="/my-entries"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Le mie voci
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        href="/admin/schedules"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin - Schedules
                      </Link>
                      <Link
                        href="/admin/visit-types"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin - Visit Types
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-white bg-red-500 hover:bg-red-700 w-full text-center cursor-pointer"
                  >
                    Esci
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/auth" className="text-green-700 hover:bg-green-50">
              Accedi / Registrati
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
