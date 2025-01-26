// app/page.tsx

import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Guides } from "./components/Guides";
import { Hero } from "./components/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Gallery />
      <Guides />
      <Contact />
      <Footer />
    </>
  );
}
