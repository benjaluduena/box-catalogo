"use client";

import React, { useState } from "react";
import Link from "next/link";

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
          <Link href="/#inicio" scroll={true} className="logo" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            BOX<span>NEUMATICOS</span>
          </Link>
          <nav>
            <ul>
              <li><Link href="/#inicio" scroll={true}>Inicio</Link></li>
              <li><Link href="/#servicios" scroll={true}>Servicios</Link></li>
              <li><Link href="/#marcas" scroll={true}>Marcas</Link></li>
              <li><Link href="/#nosotros" scroll={true}>Nosotros</Link></li>
              <li><Link href="/#contacto" scroll={true}>Ubicación</Link></li>
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
      <div className={`mobile-nav${mobileMenuOpen ? " active" : ""}`} id="mobileNav">
        <ul>
          <li><Link href="/#inicio" scroll={true} onClick={closeMobileMenu}>Inicio</Link></li>
          <li><Link href="/#servicios" scroll={true} onClick={closeMobileMenu}>Servicios</Link></li>
          <li><Link href="/#marcas" scroll={true} onClick={closeMobileMenu}>Marcas</Link></li>
          <li><Link href="/#nosotros" scroll={true} onClick={closeMobileMenu}>Nosotros</Link></li>
          <li><Link href="/#contacto" scroll={true} onClick={closeMobileMenu}>Ubicación</Link></li>
        </ul>
        <div style={{ padding: "0 20px 30px 20px", display: "flex", justifyContent: "center" }}>
          <Link href="/catalogo" onClick={closeMobileMenu} style={{
            color: "#0ea5e9",
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            borderRadius: 50,
            border: "2px solid rgba(14, 165, 233, 0.1)",
            padding: "14px 32px",
            fontWeight: 700,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(14,165,233,0.10)",
            marginTop: 10
          }}>
            <i className="fas fa-list"></i>
            <span>CATÁLOGO</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;