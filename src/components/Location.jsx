function Location() {
  return (
    <section id="contacto" className="location">
      <div className="container">
        <div className="section-header">
          <h2>Nuestra Ubicación</h2>
          <p>Encuéntranos fácilmente en Villa del Rosario, Córdoba</p>
        </div>
        <div className="location-content">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4807.898796084889!2d-63.518330655116635!3d-31.559906045129377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94332be8f47943a9%3A0x8fdb5e255594c210!2sBOX%20NEUM%C3%81TICOS!5e0!3m2!1ses!2$ar!4v1751928674111!5m2!1ses!2$ar"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups"
              title="Ubicación de Box Neumáticos"
            ></iframe>
          </div>
          <div className="location-info">
            <div className="location-card">
              <div className="location-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Dirección</h3>
              <p>
                Sarmiento y RP10<br />
                Villa del Rosario, Córdoba
              </p>
            </div>
            <div className="location-card">
              <div className="location-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Horarios</h3>
              <p>
                Lunes a Viernes: 8:00 - 12:00 y 14:00 - 18:00<br />
                Sábados: 8:00 - 12:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;