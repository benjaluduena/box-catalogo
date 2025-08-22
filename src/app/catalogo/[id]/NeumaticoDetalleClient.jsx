"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function NeumaticoDetalleClient() {
  const { id } = useParams();
  const router = useRouter();
  const [neumatico, setNeumatico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medidaSeleccionada, setMedidaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    async function fetchNeumatico() {
      const { data, error } = await supabase
        .from("neumaticos")
        .select(`*, marcas(nombre, logo), medidas(id, medida, stock)`)
        .eq("id", id)
        .single();
      if (!error) {
        setNeumatico(data);
        if (data.medidas && data.medidas.length > 0) {
          setMedidaSeleccionada(data.medidas[0]);
        }
      }
      setLoading(false);
    }
    fetchNeumatico();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando neumático...</p>;
  if (!neumatico) return <p style={{ textAlign: "center" }}>Neumático no encontrado.</p>;

  const handleCantidad = (delta) => {
    setCantidad((prev) => {
      const nueva = prev + delta;
      if (nueva < 1) return 1;
      if (medidaSeleccionada && medidaSeleccionada.stock && nueva > medidaSeleccionada.stock) return medidaSeleccionada.stock;
      return nueva;
    });
  };

  const handleMedida = (m) => {
    setMedidaSeleccionada(m);
    setCantidad(1);
  };

  const whatsappUrl = `https://wa.me/543573403958?text=Hola,%20quiero%20consultar%20por%20el%20neumático%20${encodeURIComponent(neumatico.nombre)}%20en%20medida%20${encodeURIComponent(medidaSeleccionada?.medida || "")}%20x%20${cantidad}`;

  // Schema.org para producto
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": neumatico.nombre,
    "description": neumatico.descripcion || `Neumático ${neumatico.nombre} de ${neumatico.marcas?.nombre}`,
    "brand": {
      "@type": "Brand",
      "name": neumatico.marcas?.nombre
    },
    "image": neumatico.imagen,
    "category": "Automotive Parts",
    "offers": {
      "@type": "AggregateOffer",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Box Neumáticos"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    <div style={{
      minHeight: "100vh",
      background: "#f3f6fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "96px 0 24px 0"
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        gap: 48,
        alignItems: "flex-start",
        justifyContent: "center",
        background: "rgba(255,255,255,0.98)",
        borderRadius: 32,
        boxShadow: "0 12px 48px rgba(14,165,233,0.13)",
        margin: "0 auto",
        maxWidth: 1200,
        width: "100%",
        padding: "40px 32px 48px 32px",
        minHeight: 480,
        border: "1.5px solid #e0f2fe"
      }}>
        <style>{`
          @media (max-width: 768px) {
            .marca-logo-detalle {
              top: 10px !important;
              right: 10px !important;
              width: 48px !important;
              height: 48px !important;
            }
          }
        `}</style>
        {neumatico.marcas?.logo && (
          <img
            src={neumatico.marcas.logo}
            alt={neumatico.marcas.nombre}
            className="marca-logo-detalle"
            style={{
              position: "absolute",
              top: 24,
              right: 32,
              width: 64,
              height: 64,
              objectFit: "contain",
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #e0f2fe",
              boxShadow: "0 2px 8px rgba(14,165,233,0.10)",
              zIndex: 3
            }}
          />
        )}
        <button onClick={() => router.back()} style={{
          position: "absolute",
          top: 24,
          left: 24,
          background: "#e0f2fe",
          border: "1.5px solid #bae6fd",
          fontSize: 18,
          cursor: "pointer",
          color: "#0ea5e9",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: 38,
          height: 38,
          padding: 0,
          transition: "background 0.2s, color 0.2s",
          zIndex: 2
        }} aria-label="Volver">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div style={{ minWidth: 260, maxWidth: 420, flex: 1, background: "#f8fafc", borderRadius: 24, boxShadow: "0 6px 32px rgba(14,165,233,0.10)", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <img
            src={neumatico.imagen || "/images/placeholder-tire.png"}
            alt={neumatico.nombre}
            style={{ width: "100%", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", background: "#f8fafc", maxHeight: 340, objectFit: "contain", border: "1.5px solid #e0f2fe", padding: 8 }}
          />
        </div>
        <div style={{ flex: 2, minWidth: 240, maxWidth: 540, background: "#fff", borderRadius: 20, boxShadow: "none", padding: 0, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10, color: "#0ea5e9", lineHeight: 1.1 }}>{neumatico.nombre}</h1>
          <div style={{ color: "#1e293b", fontSize: 18, marginBottom: 12, fontWeight: 600 }}>{neumatico.marcas?.nombre}</div>
          <div style={{ fontSize: 16, color: "#64748b", marginBottom: 22, minHeight: 40 }}>{neumatico.descripcion}</div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: "#0ea5e9", fontSize: 16 }}>Medidas disponibles:</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {neumatico.medidas && neumatico.medidas.map((m) => (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", background: medidaSeleccionada?.id === m.id ? "#bae6fd" : "#e0f2fe", color: medidaSeleccionada?.id === m.id ? "#0ea5e9" : "#1e293b", borderRadius: 10, padding: "7px 20px", fontWeight: medidaSeleccionada?.id === m.id ? 800 : 600, border: medidaSeleccionada?.id === m.id ? "2px solid #0ea5e9" : "1.5px solid #bae6fd", fontSize: 15, transition: "all 0.2s" }}>
                  <input
                    type="radio"
                    name="medida"
                    checked={medidaSeleccionada?.id === m.id}
                    onChange={() => handleMedida(m)}
                    style={{ accentColor: "#0ea5e9" }}
                  />
                  {m.medida}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
            <span style={{ fontWeight: 700, color: "#0ea5e9", fontSize: 16 }}>Cantidad:</span>
            <button onClick={() => handleCantidad(-1)} style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid #bae6fd", background: "#e0f2fe", fontSize: 22, fontWeight: 800, color: "#0ea5e9", cursor: "pointer", transition: "all 0.2s" }}>-</button>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#171717" }}>{cantidad}</span>
            <button onClick={() => handleCantidad(1)} style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid #bae6fd", background: "#e0f2fe", fontSize: 22, fontWeight: 800, color: "#0ea5e9", cursor: "pointer", transition: "all 0.2s" }}>+</button>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "linear-gradient(90deg,#0ea5e9,#38bdf8)", color: "#fff", borderRadius: 16, padding: "16px 36px", fontWeight: 800, fontSize: 19, textDecoration: "none", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 18px rgba(37,211,102,0.10)", border: "none", transition: "background 0.2s" }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: 24 }}></i> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}