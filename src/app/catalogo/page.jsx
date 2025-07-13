"use client";
import CatalogoNeumaticos from "../../components/CatalogoNeumaticos.jsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CatalogoPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f3f6fa 0%, #e0f2fe 100%)",
      paddingTop: "120px",
      paddingBottom: "40px"
    }}>
      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header del catálogo */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "24px",
          padding: "40px 32px",
          boxShadow: "0 8px 32px rgba(14,165,233,0.1)",
          border: "1px solid rgba(14,165,233,0.1)"
        }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: 800, 
            marginBottom: "16px", 
            background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Catálogo de Neumáticos
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "#64748b", 
            marginBottom: "32px",
            maxWidth: "600px",
            margin: "0 auto 32px auto"
          }}>
            Descubre nuestra amplia selección de neumáticos de las mejores marcas para tu vehículo
          </p>
          
          {/* Barra de búsqueda y filtros */}
          <div style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{ position: "relative", flex: "1", minWidth: "280px", maxWidth: "400px" }}>
              <input
                type="text"
                placeholder="Buscar neumáticos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 20px 16px 48px",
                  borderRadius: "16px",
                  border: "2px solid #e0f2fe",
                  fontSize: "16px",
                  background: "#fff",
                  transition: "all 0.3s ease"
                }}
              />
              <i className="fas fa-search" style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#0ea5e9",
                fontSize: "18px"
              }}></i>
            </div>
            
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{
                padding: "16px 20px",
                borderRadius: "16px",
                border: "2px solid #e0f2fe",
                fontSize: "16px",
                background: "#fff",
                minWidth: "160px",
                cursor: "pointer"
              }}
            >
              <option value="">Todas las marcas</option>
              <option value="bridgestone">Bridgestone</option>
              <option value="michelin">Michelin</option>
              <option value="pirelli">Pirelli</option>
              <option value="firestone">Firestone</option>
              <option value="fate">Fate</option>
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              style={{
                padding: "16px 20px",
                borderRadius: "16px",
                border: "2px solid #e0f2fe",
                fontSize: "16px",
                background: "#fff",
                minWidth: "160px",
                cursor: "pointer"
              }}
            >
              <option value="">Todos los precios</option>
              <option value="0-50000">Hasta $50.000</option>
              <option value="50000-100000">$50.000 - $100.000</option>
              <option value="100000-200000">$100.000 - $200.000</option>
              <option value="200000+">Más de $200.000</option>
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div style={{
          display: "flex",
          gap: "24px",
          marginBottom: "48px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.9)",
            padding: "24px",
            borderRadius: "16px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 16px rgba(14,165,233,0.08)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0ea5e9", marginBottom: "8px" }}>500+</div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Neumáticos disponibles</div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.9)",
            padding: "24px",
            borderRadius: "16px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 16px rgba(14,165,233,0.08)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0ea5e9", marginBottom: "8px" }}>5</div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Marcas premium</div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.9)",
            padding: "24px",
            borderRadius: "16px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 16px rgba(14,165,233,0.08)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0ea5e9", marginBottom: "8px" }}>24h</div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Entrega rápida</div>
          </div>
        </div>

        {/* Componente del catálogo */}
        <CatalogoNeumaticos 
          onNeumaticoClick={id => router.push(`/catalogo/${id}`)}
          searchTerm={searchTerm}
          selectedBrand={selectedBrand}
          priceRange={priceRange}
        />
      </div>
    </div>
  );
} 