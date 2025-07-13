"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

function CatalogoNeumaticos({ onNeumaticoClick, searchTerm = "", selectedBrand = "", priceRange = "" }) {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [neumaticosPorTipo, setNeumaticosPorTipo] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
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

  // Función para filtrar neumáticos
  const filterNeumaticos = (neumaticos) => {
    if (!neumaticos) return [];
    
    return neumaticos.filter(n => {
      // Filtro por búsqueda
      if (searchTerm && !n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !n.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por marca
      if (selectedBrand && n.marcas?.nombre.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      
      // Filtro por rango de precio
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
        if (n.precio < min || (max !== Infinity && n.precio > max)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Función para manejar favoritos
  const toggleFavorite = (neumaticoId) => {
    setFavorites(prev => 
      prev.includes(neumaticoId) 
        ? prev.filter(id => id !== neumaticoId)
        : [...prev, neumaticoId]
    );
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        background: "rgba(255,255,255,0.8)",
        borderRadius: "20px",
        margin: "20px 0"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e0f2fe",
            borderTop: "4px solid #0ea5e9",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px auto"
          }}></div>
          <p style={{ color: "#64748b", fontSize: "18px", fontWeight: 600 }}>Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!tiposVehiculo.length) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 20px",
        background: "rgba(255,255,255,0.8)",
        borderRadius: "20px",
        margin: "20px 0"
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: "48px", color: "#f59e0b", marginBottom: "20px" }}></i>
        <p style={{ color: "#64748b", fontSize: "18px", fontWeight: 600 }}>No hay tipos de vehículo disponibles.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {tiposVehiculo.map(tipo => {
        const neumaticosFiltrados = filterNeumaticos(neumaticosPorTipo[tipo.id]);
        
        if (neumaticosFiltrados.length === 0) return null;
        
        return (
          <div key={tipo.id} style={{ 
            marginBottom: "48px",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 8px 32px rgba(14,165,233,0.1)",
            border: "1px solid rgba(14,165,233,0.1)"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "2px solid #e0f2fe"
            }}>
              <div>
                <h2 style={{ 
                  fontSize: "28px", 
                  fontWeight: 800, 
                  color: "#0ea5e9", 
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <i className="fas fa-car" style={{ fontSize: "24px" }}></i>
                  {tipo.nombre}
                </h2>
                <p style={{ 
                  color: "#64748b", 
                  fontSize: "14px", 
                  margin: "8px 0 0 0",
                  fontWeight: 500
                }}>
                  {neumaticosFiltrados.length} neumático{neumaticosFiltrados.length !== 1 ? 's' : ''} disponible{neumaticosFiltrados.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                style={{ 
                  background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(14,165,233,0.3)"
                }}
                onClick={() => router.push(`/catalogo?tipo=${tipo.id}`)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 24px rgba(14,165,233,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 16px rgba(14,165,233,0.3)";
                }}
              >
                Ver todos <i className="fas fa-arrow-right" style={{ marginLeft: "8px" }}></i>
              </button>
            </div>
            
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
              padding: "8px 0"
            }}>
              {neumaticosFiltrados.map(n => (
                <div
                  key={n.id}
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    boxShadow: "0 4px 20px rgba(14,165,233,0.08)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid #e0f2fe",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onClick={() => onNeumaticoClick(n.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,165,233,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.08)";
                  }}
                >
                  {/* Badge de marca */}
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "rgba(14,165,233,0.1)",
                    color: "#0ea5e9",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {n.marcas?.nombre}
                  </div>

                  {/* Botón de favorito */}
                  <button
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid #e0f2fe",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      zIndex: 2
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(n.id);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    <i 
                      className={`fas fa-heart ${favorites.includes(n.id) ? 'fas' : 'far'}`}
                      style={{
                        color: favorites.includes(n.id) ? "#ef4444" : "#94a3b8",
                        fontSize: "16px",
                        transition: "all 0.2s ease"
                      }}
                    ></i>
                  </button>

                  {/* Imagen del neumático */}
                  <div style={{
                    background: "linear-gradient(135deg, #f8fafc, #e0f2fe)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "160px",
                    border: "1px solid #e0f2fe"
                  }}>
                    <img
                      src={n.imagen || "/images/placeholder-tire.png"}
                      alt={n.nombre}
                      style={{ 
                        width: "100%", 
                        height: "120px", 
                        objectFit: "contain",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                  </div>

                  {/* Información del neumático */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: 700, 
                      fontSize: "18px", 
                      color: "#1e293b", 
                      marginBottom: "8px",
                      lineHeight: "1.3",
                      minHeight: "48px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {n.nombre}
                    </h3>
                    
                    <p style={{ 
                      color: "#64748b", 
                      fontSize: "14px", 
                      marginBottom: "16px",
                      lineHeight: "1.4",
                      minHeight: "40px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {n.descripcion}
                    </p>

                    {/* Precio */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ 
                        fontWeight: 800, 
                        fontSize: "24px", 
                        color: "#171717",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        ${n.precio.toLocaleString()}
                        {n.precio_anterior && (
                          <span style={{ 
                            textDecoration: "line-through", 
                            color: "#94a3b8", 
                            fontWeight: 500, 
                            fontSize: "16px"
                          }}>
                            ${n.precio_anterior.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {n.precio_anterior && (
                        <div style={{
                          background: "#dcfce7",
                          color: "#166534",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "inline-block",
                          marginTop: "4px"
                        }}>
                          {Math.round(((n.precio_anterior - n.precio) / n.precio_anterior) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div style={{ 
                      display: "flex", 
                      gap: "12px",
                      marginTop: "auto"
                    }}>
                      <button
                        style={{ 
                          background: "#171717", 
                          color: "#fff", 
                          borderRadius: "12px", 
                          padding: "12px 16px", 
                          fontWeight: 700, 
                          fontSize: "14px",
                          border: "none",
                          cursor: "pointer",
                          flex: 1,
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          window.open(`https://wa.me/543573403958?text=Hola,%20quiero%20consultar%20por%20el%20neumático%20${encodeURIComponent(n.nombre)}`, "_blank"); 
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <i className="fab fa-whatsapp" style={{ fontSize: "16px" }}></i>
                        Consultar
                      </button>
                      
                      <button
                        style={{ 
                          background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", 
                          color: "#fff", 
                          borderRadius: "12px", 
                          padding: "12px 16px", 
                          fontWeight: 700, 
                          fontSize: "14px",
                          border: "none",
                          cursor: "pointer",
                          flex: 1,
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onNeumaticoClick(n.id); 
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 12px rgba(14,165,233,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <i className="fas fa-eye" style={{ fontSize: "14px" }}></i>
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CatalogoNeumaticos; 