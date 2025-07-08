"use client";

import React, { useRef, useState, useEffect } from "react";

function About() {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateOverlay = () => setPaused(video.paused);
    video.addEventListener("pause", updateOverlay);
    video.addEventListener("play", updateOverlay);
    // Inicializa el estado
    updateOverlay();
    return () => {
      video.removeEventListener("pause", updateOverlay);
      video.removeEventListener("play", updateOverlay);
    };
  }, []);

  return (
    <section id="nosotros" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Sobre Box Neumáticos</h2>
            <p>
              En Box Neumáticos nos dedicamos a brindar servicios de calidad para el mantenimiento y cuidado de tu vehículo.
            </p>
            <p>
              Nuestro equipo de profesionales está comprometido con ofrecer soluciones efectivas y un servicio personalizado a cada uno de nuestros clientes.
            </p>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Servicio de calidad</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Experiencia en el sector</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Precios competitivos</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-check"></i>
                </div>
                <span>Garantía en servicios</span>
              </div>
            </div>
            <a
              href="#contacto"
              className="btn"
              style={{ background: "#0ea5e9", color: "white", textDecoration: "none" }}
            >
              Conocer más
            </a>
          </div>
          <div className={`about-image${paused ? " paused" : ""}`} id="aboutVideoContainer" style={{ position: "relative" }}>
            <video
              id="aboutVideo"
              ref={videoRef}
              src="video/box-video.mp4"
              controls
              style={{ width: "100%", maxWidth: 400, borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
            />
            {paused && (
              <div
                className="pause-overlay"
                id="pauseOverlay"
                onClick={() => videoRef.current && videoRef.current.play()}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: 16,
                }}
              >
                <svg viewBox="0 0 64 64" width={64} height={64}>
                  <polygon points="16,12 56,32 16,52" fill="#fff" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;