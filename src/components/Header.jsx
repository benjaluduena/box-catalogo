"use client";

import React, { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Función para scroll suave
  const handleSmoothScroll = (e, target) => {
    if (target.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        closeMobileMenu();
      }
    }
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            BOX<span>NEUMATICOS</span>
          </div>
          <nav>
            <ul>
              <li><a href="#inicio" onClick={e => handleSmoothScroll(e, "#inicio")}>Inicio</a></li>
              <li><a href="#servicios" onClick={e => handleSmoothScroll(e, "#servicios")}>Servicios</a></li>
              <li><a href="#productos" onClick={e => handleSmoothScroll(e, "#productos")}>Productos</a></li>
              <li><a href="#nosotros" onClick={e => handleSmoothScroll(e, "#nosotros")}>Nosotros</a></li>
              <li><a href="#contacto" onClick={e => handleSmoothScroll(e, "#contacto")}>Ubicación</a></li>
            </ul>
          </nav>
          <button className="mobile-menu" onClick={toggleMobileMenu}>
            {/* Asegúrate de tener FontAwesome o usa un icono alternativo */}
            <i className="fas fa-bars"></i>
          </button>
          <div className="header-phone">
            <a
              href="/catalogo"
              style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
            >
              <i className="fas fa-list"></i>
              <span>CATÁLOGO</span>
            </a>
          </div>
        </div>
      </div>
      <div className={`mobile-nav${mobileMenuOpen ? " open" : ""}`} id="mobileNav">
        <ul>
          <li><a href="#inicio" onClick={e => handleSmoothScroll(e, "#inicio")}>Inicio</a></li>
          <li><a href="#servicios" onClick={e => handleSmoothScroll(e, "#servicios")}>Servicios</a></li>
          <li><a href="#productos" onClick={e => handleSmoothScroll(e, "#productos")}>Productos</a></li>
          <li><a href="#nosotros" onClick={e => handleSmoothScroll(e, "#nosotros")}>Nosotros</a></li>
          <li><a href="#contacto" onClick={e => handleSmoothScroll(e, "#contacto")}>Ubicación</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;