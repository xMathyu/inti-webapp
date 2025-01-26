// app/components/Hero.tsx
"use client";

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Bienvenido a Nuestra Plataforma</h1>
        <p className="mt-4 text-lg">La solución perfecta para tu negocio.</p>
        <Button className="mt-8 px-6 py-3 text-lg">Empieza Ahora</Button>
      </div>
    </section>
  );
}
