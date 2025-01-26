// app/components/Testimonials.tsx
"use client";

export function Testimonials() {
  const testimonials = [
    {
      name: "Juan Pérez",
      feedback: "Esta plataforma ha transformado mi negocio. ¡Increíble!",
    },
    {
      name: "María López",
      feedback: "El soporte es excepcional y las características son fantásticas.",
    },
    {
      name: "Carlos García",
      feedback: "Fácil de usar y muy eficiente. Recomiendo totalmente.",
    },
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center">Testimonios</h2>
        <div className="mt-12 space-y-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-md shadow-sm">
              <p className="text-lg italic">&ldquo;{testimonial.feedback}&rdquo;</p>
              <p className="mt-4 text-right font-semibold">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
