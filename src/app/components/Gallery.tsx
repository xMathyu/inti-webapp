// app/components/Gallery.tsx

"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

export function Gallery() {
  const images = [
    { src: "/mariposa.jpg", width: 800, height: 600 },
    { src: "/scouts.jpg", width: 800, height: 600 },
    { src: "/scouts2.jpg", width: 800, height: 600 },
  ];
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">
          La nostra galleria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="w-full h-64 overflow-hidden rounded shadow cursor-pointer group"
              onClick={() => {
                setOpen(true);
                setCurrentIndex(idx);
              }}
            >
              <Image
                src={image.src}
                alt={`Galería ${idx + 1}`}
                width={image.width}
                height={image.height}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((image) => ({ src: image.src }))}
        index={currentIndex}
        on={{
          click: () => {}, // handle clicks inside the lightbox if needed
        }}
      />
    </section>
  );
}
