"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const filtros = ["Todo", "Autos", "Camionetas", "Camiones"];

function CatalogoNeumaticos({ onNeumaticoClick }) {
  const [neumaticos, setNeumaticos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNeumaticos() {
      const { data, error } = await supabase
        .from("neumaticos")
        .select(`*, marcas(nombre, logo), medidas(id, medida, stock)`)
        .order("id", { ascending: true });
      if (!error) setNeumaticos(data);
      setLoading(false);
    }
    fetchNeumaticos();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando neumáticos...</p>;

  if (!neumaticos.length) return <p style={{ textAlign: "center" }}>No hay neumáticos disponibles.</p>;

  return (
    <div style={{ width: "100%", background: "#f3f6fa", minHeight: "100vh", paddingBottom: 32 }}>
      {/* Filtros visuales tipo chips */}
      <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 0 18px 0", marginBottom: 10 }}>
        {filtros.map((f, i) => (
          <button
            key={f}
            style={{
              background: i === 0 ? "#0ea5e9" : "#e0f2fe",
              color: i === 0 ? "#fff" : "#0ea5e9",
              border: "none",
              borderRadius: 18,
              padding: "8px 22px",
              fontWeight: 700,
              fontSize: 16,
              boxShadow: i === 0 ? "0 2px 8px rgba(14,165,233,0.10)" : "none",
              cursor: "pointer",
              outline: "none",
              minWidth: 90,
              transition: "background 0.2s, color 0.2s"
            }}
            tabIndex={-1}
          >
            {f}
          </button>
        ))}
      </div>
      {/* Catálogo grid adaptativo */}
      <div className="catalogo-grid">
        {neumaticos.map((n) => (
          <div
            key={n.id}
            className="neumatico-card"
            style={{
              cursor: onNeumaticoClick ? "pointer" : "default"
            }}
            onClick={onNeumaticoClick ? () => onNeumaticoClick(n.id) : undefined}
          >
            <img
              src={n.imagen || "/images/placeholder-tire.png"}
              alt={n.nombre}
              style={{ width: 64, height: 64, objectFit: "contain", background: "#f8fafc", borderRadius: 10, boxShadow: "0 1px 4px rgba(14,165,233,0.05)", flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0, marginLeft: 12, display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{n.nombre}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: 2, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.descripcion}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#171717", marginBottom: 2 }}>
                ${n.precio}
                {n.precio_anterior && (
                  <span style={{ textDecoration: "line-through", color: "#94a3b8", marginLeft: 6, fontWeight: 500, fontSize: 12 }}>
                    ${n.precio_anterior}
                  </span>
                )}
              </div>
            </div>
            <a
              href={`https://wa.me/543573403958?text=Hola,%20quiero%20consultar%20por%20el%20neumático%20${encodeURIComponent(n.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                background: "#171717",
                color: "#fff",
                borderRadius: 8,
                padding: 7,
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: "none",
                border: "none",
                marginLeft: 10,
                minWidth: 32,
                minHeight: 32,
                width: 32,
                height: 32
              }}
              onClick={e => e.stopPropagation()}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: 16 }}></i>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoNeumaticos; 