"use client";
import CatalogoNeumaticosEnhanced from "../../components/CatalogoNeumaticosEnhanced";

export default function CatalogoPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <div style={{ 
        padding: "2rem 0 1rem 0", 
        background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
        textAlign: "center",
        color: "white"
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            marginBottom: "0.5rem",
            letterSpacing: "-1px"
          }}>
            Catálogo de Neumáticos
          </h1>
          <p style={{ 
            fontSize: "1.1rem", 
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Encuentra los neumáticos perfectos para tu vehículo con nuestra búsqueda avanzada y filtros inteligentes
          </p>
        </div>
      </div>
      <CatalogoNeumaticosEnhanced />
    </main>
  );
} 