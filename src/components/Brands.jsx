function Brands() {
  return (
    <section id="productos" className="brands">
      <div className="container">
        <div className="section-header">
          <h2>Marcas que Ofrecemos</h2>
          <p>
            Trabajamos con las mejores marcas del mercado para garantizar calidad y durabilidad.
          </p>
        </div>
        <div className="brands-grid">
          <div className="brand-card">
            <img
              src="images/michelin.png"
              alt="Michelin"
              style={{ maxWidth: 140, maxHeight: 80, display: "block", margin: "0 auto" }}
            />
            <div className="brand-text">Michelin</div>
          </div>
          <div className="brand-card">
            <img
              src="images/bridgestone.png"
              alt="Bridgestone"
              style={{ maxWidth: 140, maxHeight: 80, display: "block", margin: "0 auto" }}
            />
            <div className="brand-text">Bridgestone</div>
          </div>
          <div className="brand-card">
            <img
              src="images/pirelli.png"
              alt="Pirelli"
              style={{ maxWidth: 140, maxHeight: 80, display: "block", margin: "0 auto" }}
            />
            <div className="brand-text">Pirelli</div>
          </div>
          <div className="brand-card">
            <img
              src="images/firestone.png"
              alt="Firestone"
              style={{ maxWidth: 140, maxHeight: 80, display: "block", margin: "0 auto" }}
            />
            <div className="brand-text">Firestone</div>
          </div>
          <div className="brand-card">
            <img
              src="images/fate.png"
              alt="Fate"
              style={{ maxWidth: 140, maxHeight: 80, display: "block", margin: "0 auto" }}
            />
            <div className="brand-text">Fate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brands;