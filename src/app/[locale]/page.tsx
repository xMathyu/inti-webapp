// app/page.tsx

import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Guides } from "./components/Guides";
import { Hero } from "./components/Hero";
import { VisitsPricing } from "./components/VisitsPricing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Gallery />
      <Guides />
      <VisitsPricing />
      <Contact />
      <Footer />
    </>
  );
}
