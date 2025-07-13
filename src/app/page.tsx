import React from "react";
import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import Brands from "../components/Brands.jsx";
import About from "../components/About.jsx";
import Location from "../components/Location.jsx";

const HomePage = (): React.JSX.Element => {
  return (
    <main role="main">
      <Hero />
      <Services />
      <Brands />
      <About />
      <Location />
    </main>
  );
};

export default HomePage; 