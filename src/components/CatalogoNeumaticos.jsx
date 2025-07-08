"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function CatalogoNeumaticos() {
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
    <div className="catalogo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
      {neumaticos.map((n) => (
        <div key={n.id} className="neumatico-card" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={n.imagen || "/images/placeholder-tire.png"}
            alt={n.nombre}
            style={{ width: 120, height: 120, objectFit: "contain", marginBottom: 16 }}
          />
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{n.nombre}</div>
          <div style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>{n.marcas?.nombre}</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
            ${n.precio}
            {n.precio_anterior && (
              <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8, fontWeight: 400 }}>
                ${n.precio_anterior}
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: "#444", marginBottom: 12, textAlign: "center" }}>{n.descripcion}</div>
          {n.medidas && n.medidas.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {n.medidas.map((m) => (
                <span key={m.id} style={{ background: "#f3f3f3", borderRadius: 8, padding: "2px 10px", fontSize: 13 }}>
                  {m.medida} {m.stock !== null && <span style={{ color: '#22c55e', fontWeight: 500 }}>({m.stock})</span>}
                </span>
              ))}
            </div>
          )}
          <a
            href={`https://wa.me/543573403958?text=Hola,%20quiero%20consultar%20por%20el%20neumático%20${encodeURIComponent(n.nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: 8, background: "#25D366", color: "#fff", borderRadius: 8, padding: "8px 18px", fontWeight: 600, textDecoration: "none", display: "inline-block" }}
          >
            Consultar por WhatsApp
          </a>
        </div>
      ))}
    </div>
  );
}

export default CatalogoNeumaticos; 