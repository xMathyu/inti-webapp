"use client";

import { Hero } from './components/Hero';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Features } from './components/Feature';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default HomePage;
