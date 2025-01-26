// app/components/Footer.tsx
"use client";

export function Footer() {
  return (
    <footer className="py-6 bg-gray-800 text-white text-center">
      <p>&copy; {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.</p>
    </footer>
  );
}
