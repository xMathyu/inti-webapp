// app/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-md">
      <Link href="/">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
      </Link>
      <div className="space-x-4">
        <Link href="#features">
          <Button variant="ghost">Características</Button>
        </Link>
        <Link href="#testimonials">
          <Button variant="ghost">Testimonios</Button>
        </Link>
        <Link href="#cta">
          <Button>Comienza Ahora</Button>
        </Link>
      </div>
    </nav>
  );
}
