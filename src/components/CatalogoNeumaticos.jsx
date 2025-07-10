"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

function CatalogoNeumaticos() {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [neumaticosPorTipo, setNeumaticosPorTipo] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTiposYNeumaticos() {
      setLoading(true);
      // Obtener tipos de vehículo
      const { data: tipos, error: errorTipos } = await supabase
        .from("tipos_vehiculo")
        .select("id, nombre")
        .order("nombre");
      if (errorTipos) {
        setTiposVehiculo([]);
        setLoading(false);
        return;
      }
      setTiposVehiculo(tipos);
      // Obtener neumáticos agrupados por tipo
      const { data: neumaticos, error: errorNeumaticos } = await supabase
        .from("neumaticos")
        .select("*, marcas(nombre, logo), tipos_vehiculo(nombre)")
        .order("id", { ascending: true });
      if (errorNeumaticos) {
        setNeumaticosPorTipo({});
        setLoading(false);
        return;
      }
      // Agrupar neumáticos por tipo_id
      const agrupados = {};
      tipos.forEach(tipo => {
        agrupados[tipo.id] = [];
      });
      neumaticos.forEach(n => {
        if (n.tipo_id && agrupados[n.tipo_id]) {
          agrupados[n.tipo_id].push(n);
        }
      });
      setNeumaticosPorTipo(agrupados);
      setLoading(false);
    }
    fetchTiposYNeumaticos();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando catálogo...</p>;
  if (!tiposVehiculo.length) return <p style={{ textAlign: "center" }}>No hay tipos de vehículo disponibles.</p>;

  return (
    <div style={{ width: "100%", background: "#f3f6fa", minHeight: "100vh", paddingBottom: 32 }}>
      {tiposVehiculo.map(tipo => (
        <div key={tipo.id} style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 8px 12px 8px" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0ea5e9", margin: 0 }}>{tipo.nombre}</h2>
            <button
              style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 700, fontSize: 16, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => router.push(`/catalogo?tipo=${tipo.id}`)}
            >
              Ver más
            </button>
          </div>
          <div style={{ display: "flex", gap: 18, overflowX: "auto", padding: "8px 0 8px 8px" }}>
            {(neumaticosPorTipo[tipo.id] || []).length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 16, padding: 24 }}>No hay neumáticos para este tipo.</div>
            ) : (
              neumaticosPorTipo[tipo.id].map(n => (
                <div
                  key={n.id}
                  style={{
                    minWidth: 320,
                    maxWidth: 340,
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 2px 12px rgba(14,165,233,0.07)",
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginRight: 8,
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                  onClick={() => router.push(`/catalogo/${n.id}`)}
                >
                  <img
                    src={n.imagen || "/images/placeholder-tire.png"}
                    alt={n.nombre}
                    style={{ width: "100%", height: 120, objectFit: "contain", background: "#f8fafc", borderRadius: 10, marginBottom: 8 }}
                  />
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.nombre}</div>
                  <div style={{ color: "#64748b", fontSize: 14, marginBottom: 2, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.descripcion}</div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#171717", marginBottom: 2 }}>
                    ${n.precio}
                    {n.precio_anterior && (
                      <span style={{ textDecoration: "line-through", color: "#94a3b8", marginLeft: 6, fontWeight: 500, fontSize: 13 }}>
                        ${n.precio_anterior}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      style={{ background: "#171717", color: "#fff", borderRadius: 8, padding: 7, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "none", border: "none", minWidth: 32, minHeight: 32, width: 32, height: 32, cursor: "pointer" }}
                      onClick={e => { e.stopPropagation(); window.open(`https://wa.me/543573403958?text=Hola,%20quiero%20consultar%20por%20el%20neumático%20${encodeURIComponent(n.nombre)}`, "_blank"); }}
                    >
                      <i className="fab fa-whatsapp" style={{ fontSize: 16 }}></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CatalogoNeumaticos; 