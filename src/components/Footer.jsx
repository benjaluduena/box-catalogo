function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo" style={{ marginBottom: 16 }}>
              BOX<span style={{ color: "white" }}>NEUMATICOS</span>
            </div>
            <p>
              Expertos en neumáticos y servicios automotrices de calidad para mantener tu vehículo en óptimas condiciones.
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/box.neumaticos/">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/543573403958">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#productos">Productos</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#contacto">Ubicación</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Servicios</h3>
            <ul>
              <li><a href="#">Colocación</a></li>
              <li><a href="#">Rotación</a></li>
              <li><a href="#">Balanceo</a></li>
              <li><a href="#">Venta de Neumáticos</a></li>
              <li><a href="#">Servicio de Gomería</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Sarmiento y RP10, Villa del Rosario, Córdoba</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>3573403958</span>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>Lun-Vie: 8:00 - 12:00 y 14:00 - 18:00 | Sáb: 8:00 - 12:00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; <span>{currentYear}</span> Box Neumáticos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
