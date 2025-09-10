"use client";
import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Brands from "../components/Brands";
import About from "../components/About";
import Location from "../components/Location";

export default function Home() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observar todas las secciones
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="hero" className={`section-transition ${visibleSections.has('hero') ? 'visible' : ''}`}>
        <Hero />
      </section>
      <section id="services" className={`section-transition ${visibleSections.has('services') ? 'visible' : ''}`}>
        <Services />
      </section>
      <section id="brands" className={`section-transition ${visibleSections.has('brands') ? 'visible' : ''}`}>
        <Brands />
      </section>
      <section id="about" className={`section-transition ${visibleSections.has('about') ? 'visible' : ''}`}>
        <About />
      </section>
      <section id="location" className={`section-transition ${visibleSections.has('location') ? 'visible' : ''}`}>
        <Location />
      </section>
    </>
  );
}
