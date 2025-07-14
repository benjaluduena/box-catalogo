"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

// Subcomponente para la tarjeta de neumático
function NeumaticoCard({ neumatico, onClick }) {
  const { nombre, descripcion, precio, precio_anterior, imagen, marcas } = neumatico;
  // Formateo de precios con puntos
  const precioFormateado = typeof precio === 'number' ? precio.toLocaleString('es-AR') : precio;
  const precioAnteriorFormateado = typeof precio_anterior === 'number' ? precio_anterior.toLocaleString('es-AR') : precio_anterior;
  return (
    <div className="neumatico-card" onClick={onClick} style={{ cursor: "pointer", position: "relative" }}>
      {/* Banda de marca reubicada a la izquierda */}
      {marcas?.nombre && (
        <div style={{
          position: "absolute",
          top: 14,
          left: 18,
          background: "#e0f2fe",
          color: "#0ea5e9",
          fontWeight: 700,
          fontSize: 13,
          borderRadius: 12,
          padding: "2px 16px",
          zIndex: 2,
          letterSpacing: 0.5,
          textTransform: "uppercase"
        }}>{marcas.nombre}</div>
      )}
      {/* Imagen */}
      <div style={{ flex: "0 0 110px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 24 }}>
        <img
          src={imagen || "/images/placeholder-tire.png"}
          alt={nombre}
          style={{ width: 96, height: 96, objectFit: "contain", background: "transparent", borderRadius: 14, boxShadow: "0 2px 8px rgba(14,165,233,0.08)" }}
        />
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 19, color: "#1e293b", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nombre}</div>
        <div style={{ color: "#64748b", fontSize: 15, marginBottom: 2, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{descripcion}</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: "#171717", marginBottom: 2, display: "flex", alignItems: "center", gap: 10 }}>
          ${precioFormateado}
          {precio_anterior && (
            <span style={{ textDecoration: "line-through", color: "#94a3b8", marginLeft: 6, fontWeight: 500, fontSize: 15 }}>${precioAnteriorFormateado}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            className="btn btn-primary btn-ver-mas"
            style={{ borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 16, border: "none", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            onClick={e => { e.stopPropagation(); onClick(); }}
            aria-label="Ver más"
          >
            <i className="fas fa-eye" style={{ fontSize: 18 }}></i>
            <span className="ver-mas-text" style={{ display: "inline" }}> <span style={{ fontSize: 16 }}>Ver más</span></span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogoNeumaticos() {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [neumaticosPorTipo, setNeumaticosPorTipo] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);
  const [destacados, setDestacados] = useState([]);

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
      // Filtrar destacados
      setDestacados(neumaticos.filter(n => n.destacado));
      setLoading(false);
    }
    fetchTiposYNeumaticos();
  }, []);

  // Manejar expansión de categorías
  const handleExpandirCategoria = (tipoId) => {
    setCategoriasExpandidas((prev) =>
      prev.includes(tipoId)
        ? prev.filter((id) => id !== tipoId)
        : [...prev, tipoId]
    );
  };

  // Función para obtener el icono según el nombre de la categoría
  function getCategoriaIcon(nombre) {
    if (!nombre) return "fa-box";
    const n = nombre.toLowerCase();
    if (n.includes("auto")) return "fa-car";
    if (n.includes("camioneta")) return "fa-truck-pickup";
    if (n.includes("camion")) return "fa-truck";
    if (n.includes("moto")) return "fa-motorcycle";
    if (n.includes("agro")) return "fa-tractor";
    if (n.includes("destacad")) return "fa-star";
    return "fa-box";
  }

  // Estilo de fondo para las categorías
  const categoriaStyle = {
    background: '#fff',
    borderRadius: 28,
    boxShadow: '0 8px 32px rgba(14,165,233,0.10)',
    border: '1.5px solid #e0f2fe',
    padding: '36px 32px 40px 32px',
    margin: '0 auto',
    maxWidth: 1300,
    width: '100%',
    transition: 'box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando catálogo...</p>;
  if (!tiposVehiculo.length) return <p style={{ textAlign: "center" }}>No hay tipos de vehículo disponibles.</p>;

  // Mover el tipo 'Agro' al final si existe
  const tiposOrdenados = [...tiposVehiculo];
  const idxAgro = tiposOrdenados.findIndex(t => t.nombre && t.nombre.toLowerCase() === 'agro');
  if (idxAgro !== -1) {
    const [agro] = tiposOrdenados.splice(idxAgro, 1);
    tiposOrdenados.push(agro);
  }

  return (
    <div style={{ width: "100%", background: "#f3f6fa", minHeight: "100vh", paddingBottom: 32 }}>
      <style>{`
        @media (max-width: 768px) {
          .catalogo-grid {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            gap: 0 !important;
            scroll-snap-type: x mandatory !important;
            scroll-behavior: smooth !important;
            padding-bottom: 8px;
            padding-left: 12px;
            padding-right: 12px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .catalogo-grid::-webkit-scrollbar {
            display: none;
          }
          .neumatico-card {
            min-width: 92vw !important;
            max-width: 92vw !important;
            flex: 0 0 92vw !important;
            scroll-snap-align: center !important;
            margin-left: 4px;
            margin-right: 4px;
            box-sizing: border-box;
            transition: box-shadow 0.2s;
          }
        }
        @media (min-width: 769px) {
          .catalogo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 24px;
          }
          .neumatico-card {
            min-width: 0;
            max-width: 100%;
          }
        }
      `}</style>
      {/* Categoría Destacados */}
      {destacados.length > 0 && (
        <div key="destacados" style={{ marginBottom: 56 }}>
          <div style={categoriaStyle}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0ea5e9", margin: 0, marginBottom: 18, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className={`fas ${getCategoriaIcon('destacados')}`} style={{ fontSize: 26, color: '#0ea5e9', minWidth: 28 }}></i>
              Destacados
            </h2>
            <div className="catalogo-grid">
              {destacados.map(n => (
                <NeumaticoCard
                  key={n.id}
                  neumatico={n}
                  onClick={() => router.push(`/catalogo/${n.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {tiposOrdenados.map(tipo => {
        const estaExpandida = categoriasExpandidas.includes(tipo.id);
        const neumaticos = neumaticosPorTipo[tipo.id] || [];
        const mostrarNeumaticos = estaExpandida ? neumaticos : neumaticos.slice(0, 3);
        return (
          <div key={tipo.id} style={{ marginBottom: 56 }}>
            <div style={categoriaStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0ea5e9", margin: 0, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`fas ${getCategoriaIcon(tipo.nombre)}`} style={{ fontSize: 26, color: '#0ea5e9', minWidth: 28 }}></i>
                  {tipo.nombre}
                </h2>
                {neumaticos.length > 3 && (
                  <button
                    style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 700, fontSize: 16, cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleExpandirCategoria(tipo.id)}
                  >
                    {estaExpandida ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
              <div className="catalogo-grid">
                {neumaticos.length === 0 ? (
                  <div style={{ color: "#64748b", fontSize: 16, padding: 24 }}>No hay neumáticos para este tipo.</div>
                ) : (
                  mostrarNeumaticos.map(n => (
                    <NeumaticoCard
                      key={n.id}
                      neumatico={n}
                      onClick={() => router.push(`/catalogo/${n.id}`)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CatalogoNeumaticos; 