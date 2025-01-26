// app/components/Features.tsx
"use client";

import { Card } from '@/components/ui/card';

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center">Características</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Fácil de Usar</h3>
            <p className="mt-2">Interfaz intuitiva que facilita el uso.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Seguridad</h3>
            <p className="mt-2">Protegemos tus datos con los más altos estándares.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl font-bold">Soporte 24/7</h3>
            <p className="mt-2">Siempre estamos aquí para ayudarte.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
