// app/components/CTA.tsx
"use client";

import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section id="cta" className="py-20 bg-blue-600 text-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-semibold">Listo para comenzar?</h2>
        <p className="mt-4 text-lg">Únete a miles de usuarios satisfechos y lleva tu negocio al siguiente nivel.</p>
        <Button className="mt-8 px-6 py-3 text-lg">Regístrate Ahora</Button>
      </div>
    </section>
  );
}
