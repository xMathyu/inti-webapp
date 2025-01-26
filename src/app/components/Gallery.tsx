// app/components/Gallery.tsx

"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function Gallery() {
  const images = ["/mariposas.jpg", "/eventos.jpg", "/eventos2.jpg"];
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">
          Nuestra Galería
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="w-full h-64 overflow-hidden rounded shadow cursor-pointer group"
              onClick={() => {
                setOpen(true);
                setCurrentIndex(idx);
              }}
            >
              <img
                src={src}
                alt={`Galería ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((src) => ({ src }))}
        index={currentIndex}
        on={{
          click: () => {}, // manejar clicks dentro del lightbox si quieres
        }}
      />
    </section>
  );
}
