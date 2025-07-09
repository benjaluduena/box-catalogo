function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Expertos en Neumáticos y Servicios Automotrices</h1>
          <p>
            Ofrecemos la mejor selección de neumáticos y servicios de calidad para mantener tu vehículo en óptimas condiciones.
          </p>
          <div className="hero-buttons hide-mobile">
            <a href="#servicios" className="btn btn-primary">
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;