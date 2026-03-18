import Hero from "../components/Hero";
import Services from "../components/Services";
import Brands from "../components/Brands";
import About from "../components/About";
import Location from "../components/Location";

export default function Home() {
  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="brands">
        <Brands />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="location">
        <Location />
      </section>
    </>
  );
}
