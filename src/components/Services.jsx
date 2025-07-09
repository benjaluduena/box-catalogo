"use client";

import { useEffect, useState } from "react";

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);
  return isMobile;
}

function Services() {
  const isMobile = useIsMobile();
  return (
    <section id="servicios" className="services">
      <div className="container">
        <div className="section-header">
          <h2>Nuestros Servicios</h2>
          <p>
            Ofrecemos una amplia gama de servicios para mantener tu vehículo en perfectas condiciones.
          </p>
        </div>
        <div className="services-grid custom-services-grid">
          <div className="services-row">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-circle"></i>
              </div>
              <h3>Venta de Neumáticos</h3>
              {!isMobile && <p>Para autos, camionetas, camiones y el agro.</p>}
              {isMobile ? (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Venta%20de%20Neum%C3%A1ticos"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 32, height: 32, marginLeft: 'auto', color: '#25d366', fontSize: 22, background: 'none', border: 'none', boxShadow: 'none', padding: 0
                  }}
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              ) : (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Venta%20de%20Neum%C3%A1ticos"
                  target="_blank"
                  className="presupuesto-btn"
                  rel="noopener noreferrer"
                >
                  Presupuesto
                </a>
              )}
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-arrow-down"></i>
              </div>
              <h3>Colocación</h3>
              {!isMobile && (
                <p>
                  Instalación profesional de neumáticos para garantizar seguridad y rendimiento óptimo en tu vehículo.
                </p>
              )}
              {isMobile ? (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Colocaci%C3%B3n%20de%20neum%C3%A1ticos"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 32, height: 32, marginLeft: 'auto', color: '#25d366', fontSize: 22, background: 'none', border: 'none', boxShadow: 'none', padding: 0
                  }}
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              ) : (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Colocaci%C3%B3n%20de%20neum%C3%A1ticos"
                  target="_blank"
                  className="presupuesto-btn"
                  rel="noopener noreferrer"
                >
                  Presupuesto
                </a>
              )}
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Rotación</h3>
              {!isMobile && (
                <p>
                  Rotamos tus neumáticos para asegurar un desgaste uniforme y prolongar su vida útil.
                </p>
              )}
              {isMobile ? (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Rotaci%C3%B3n%20de%20neum%C3%A1ticos"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 32, height: 32, marginLeft: 'auto', color: '#25d366', fontSize: 22, background: 'none', border: 'none', boxShadow: 'none', padding: 0
                  }}
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              ) : (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Rotaci%C3%B3n%20de%20neum%C3%A1ticos"
                  target="_blank"
                  className="presupuesto-btn"
                  rel="noopener noreferrer"
                >
                  Presupuesto
                </a>
              )}
            </div>
          </div>
          <div className="services-row">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3>Balanceo</h3>
              {!isMobile && (
                <p>
                  Balanceo preciso de neumáticos para una conducción suave y sin vibraciones.
                </p>
              )}
              {isMobile ? (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Balanceo%20de%20neum%C3%A1ticos"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 32, height: 32, marginLeft: 'auto', color: '#25d366', fontSize: 22, background: 'none', border: 'none', boxShadow: 'none', padding: 0
                  }}
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              ) : (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Balanceo%20de%20neum%C3%A1ticos"
                  target="_blank"
                  className="presupuesto-btn"
                  rel="noopener noreferrer"
                >
                  Presupuesto
                </a>
              )}
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Servicio de Gomería</h3>
              {!isMobile && (
                <p>
                  Atención integral para todo tipo de vehículos. Reparaciones, parches y más.
                </p>
              )}
              {isMobile ? (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Servicio%20de%20Gomer%C3%ADa"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 32, height: 32, marginLeft: 'auto', color: '#25d366', fontSize: 22, background: 'none', border: 'none', boxShadow: 'none', padding: 0
                  }}
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              ) : (
                <a
                  href="https://wa.me/543573403958?text=Hola%2C%20quisiera%20pedir%20un%20presupuesto%20por%20Servicio%20de%20Gomer%C3%ADa"
                  target="_blank"
                  className="presupuesto-btn"
                  rel="noopener noreferrer"
                >
                  Presupuesto
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;