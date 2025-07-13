"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function NeumaticoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [neumatico, setNeumatico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medidaSeleccionada, setMedidaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const whatsappUrl = `https://wa.me/543573403958?text=Hola,%20quiero%20consultar%20por%20el%20neumático%20${encodeURIComponent(neumatico?.nombre || "")}%20en%20medida%20${encodeURIComponent(medidaSeleccionada?.medida || "")}%20x%20${cantidad}`;

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f6fa 0%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "120px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            border: "6px solid #e0f2fe",
            borderTop: "6px solid #0ea5e9",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 24px auto"
          }}></div>
          <p style={{ color: "#64748b", fontSize: "20px", fontWeight: 600 }}>Cargando neumático...</p>
        </div>
      </div>
    );
  }

  if (!neumatico) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f6fa 0%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "120px"
      }}>
        <div style={{ textAlign: "center" }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: "64px", color: "#f59e0b", marginBottom: "24px" }}></i>
          <p style={{ color: "#64748b", fontSize: "20px", fontWeight: 600 }}>Neumático no encontrado.</p>
          <button
            onClick={() => router.back()}
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "16px",
              transition: "all 0.3s ease"
            }}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3f6fa 0%, #e0f2fe 100%)",
      paddingTop: "120px",
      paddingBottom: "40px"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 20px"
      }}>
        {/* Botón de volver */}
        <button 
          onClick={() => router.back()} 
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "2px solid #e0f2fe",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: "24px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 16px rgba(14,165,233,0.1)"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 24px rgba(14,165,233,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 16px rgba(14,165,233,0.1)";
          }}
        >
          <i className="fas fa-arrow-left" style={{ fontSize: "20px", color: "#0ea5e9" }}></i>
        </button>

        {/* Contenido principal */}
        <div style={{
          background: "rgba(255,255,255,0.98)",
          borderRadius: "32px",
          boxShadow: "0 16px 64px rgba(14,165,233,0.15)",
          border: "2px solid rgba(14,165,233,0.1)",
          overflow: "hidden"
        }}>
          {/* Header del producto */}
          <div style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
            padding: "32px 40px",
            color: "#fff",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              display: "flex",
              gap: "12px"
            }}>
              <button
                onClick={toggleFavorite}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.background = "rgba(255,255,255,0.2)";
                }}
              >
                <i 
                  className={`fas fa-heart ${isFavorite ? 'fas' : 'far'}`}
                  style={{
                    color: isFavorite ? "#ef4444" : "#fff",
                    fontSize: "20px",
                    transition: "all 0.3s ease"
                  }}
                ></i>
              </button>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px"
            }}>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {neumatico.marcas?.nombre}
              </div>
              {neumatico.precio_anterior && (
                <div style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: 700
                }}>
                  {Math.round(((neumatico.precio_anterior - neumatico.precio) / neumatico.precio_anterior) * 100)}% OFF
                </div>
              )}
            </div>

            <h1 style={{ 
              fontSize: "42px", 
              fontWeight: 800, 
              margin: "0 0 12px 0",
              lineHeight: "1.1"
            }}>
              {neumatico.nombre}
            </h1>
            
            <p style={{ 
              fontSize: "18px", 
              opacity: 0.9,
              margin: 0,
              maxWidth: "600px"
            }}>
              {neumatico.descripcion}
            </p>
          </div>

          {/* Contenido del producto */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            padding: "48px 40px"
          }}>
            {/* Columna de imagen */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #f8fafc, #e0f2fe)",
                borderRadius: "24px",
                padding: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #e0f2fe",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onClick={() => setShowImageModal(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,165,233,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <img
                  src={neumatico.imagen || "/images/placeholder-tire.png"}
                  alt={neumatico.nombre}
                  style={{ 
                    width: "100%", 
                    maxHeight: "400px", 
                    objectFit: "contain",
                    borderRadius: "16px"
                  }}
                />
              </div>

              {/* Características del neumático */}
              <div style={{
                background: "#f8fafc",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #e0f2fe"
              }}>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0ea5e9",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="fas fa-info-circle"></i>
                  Características
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#64748b"
                  }}>
                    <i className="fas fa-tag" style={{ color: "#0ea5e9" }}></i>
                    <span>Marca: <strong>{neumatico.marcas?.nombre}</strong></span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#64748b"
                  }}>
                    <i className="fas fa-car" style={{ color: "#0ea5e9" }}></i>
                    <span>Tipo: <strong>{neumatico.tipos_vehiculo?.nombre}</strong></span>
                  </div>
                  {neumatico.medidas && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#64748b",
                      gridColumn: "1 / -1"
                    }}>
                      <i className="fas fa-ruler" style={{ color: "#0ea5e9" }}></i>
                      <span>Medidas: <strong>{neumatico.medidas.length} disponibles</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna de información */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px"
            }}>
              {/* Precio */}
              <div style={{
                background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                borderRadius: "20px",
                padding: "24px",
                border: "2px solid #bae6fd"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "16px",
                  marginBottom: "8px"
                }}>
                  <span style={{ 
                    fontWeight: 800, 
                    fontSize: "36px", 
                    color: "#171717"
                  }}>
                    ${neumatico.precio.toLocaleString()}
                  </span>
                  {neumatico.precio_anterior && (
                    <span style={{ 
                      textDecoration: "line-through", 
                      color: "#94a3b8", 
                      fontSize: "24px", 
                      fontWeight: 600 
                    }}>
                      ${neumatico.precio_anterior.toLocaleString()}
                    </span>
                  )}
                </div>
                {neumatico.precio_anterior && (
                  <p style={{
                    color: "#166534",
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: 0
                  }}>
                    Ahorras ${(neumatico.precio_anterior - neumatico.precio).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Selección de medida */}
              {neumatico.medidas && neumatico.medidas.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#0ea5e9",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <i className="fas fa-ruler"></i>
                    Selecciona la medida
                  </h3>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "12px"
                  }}>
                    {neumatico.medidas.map((m) => (
                      <label 
                        key={m.id} 
                        style={{ 
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          background: medidaSeleccionada?.id === m.id ? "#bae6fd" : "#f8fafc",
                          color: medidaSeleccionada?.id === m.id ? "#0ea5e9" : "#1e293b",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          fontWeight: medidaSeleccionada?.id === m.id ? 700 : 600,
                          border: medidaSeleccionada?.id === m.id ? "2px solid #0ea5e9" : "1px solid #e0f2fe",
                          fontSize: "14px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <input
                          type="radio"
                          name="medida"
                          checked={medidaSeleccionada?.id === m.id}
                          onChange={() => handleMedida(m)}
                          style={{ accentColor: "#0ea5e9" }}
                        />
                        <div>
                          <div style={{ fontWeight: "inherit" }}>{m.medida}</div>
                          {m.stock && (
                            <div style={{
                              fontSize: "12px",
                              opacity: 0.7,
                              marginTop: "2px"
                            }}>
                              Stock: {m.stock}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de cantidad */}
              <div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0ea5e9",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="fas fa-shopping-cart"></i>
                  Cantidad
                </h3>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "#f8fafc",
                  borderRadius: "16px",
                  padding: "16px 24px",
                  border: "1px solid #e0f2fe"
                }}>
                  <button 
                    onClick={() => handleCantidad(-1)} 
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "12px", 
                      border: "2px solid #bae6fd", 
                      background: "#e0f2fe", 
                      fontSize: "20px", 
                      fontWeight: 800, 
                      color: "#0ea5e9", 
                      cursor: "pointer", 
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.background = "#bae6fd";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.background = "#e0f2fe";
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    fontSize: "24px", 
                    fontWeight: 700, 
                    color: "#171717",
                    minWidth: "60px",
                    textAlign: "center"
                  }}>
                    {cantidad}
                  </span>
                  <button 
                    onClick={() => handleCantidad(1)} 
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "12px", 
                      border: "2px solid #bae6fd", 
                      background: "#e0f2fe", 
                      fontSize: "20px", 
                      fontWeight: 800, 
                      color: "#0ea5e9", 
                      cursor: "pointer", 
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.background = "#bae6fd";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.background = "#e0f2fe";
                    }}
                  >
                    +
                  </button>
                </div>
                {medidaSeleccionada?.stock && (
                  <p style={{
                    fontSize: "14px",
                    color: "#64748b",
                    marginTop: "8px",
                    marginBottom: 0
                  }}>
                    Stock disponible: {medidaSeleccionada.stock} unidades
                  </p>
                )}
              </div>

              {/* Botones de acción */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#25d366",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "20px 32px",
                    fontWeight: 800,
                    fontSize: "18px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 24px rgba(37,211,102,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 32px rgba(37,211,102,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 24px rgba(37,211,102,0.3)";
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "24px" }}></i>
                  Consultar por WhatsApp
                </a>
                
                <button
                  onClick={() => router.push('/catalogo')}
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "16px 32px",
                    fontWeight: 700,
                    fontSize: "16px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 16px rgba(14,165,233,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 24px rgba(14,165,233,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 16px rgba(14,165,233,0.3)";
                  }}
                >
                  <i className="fas fa-arrow-left" style={{ fontSize: "16px" }}></i>
                  Volver al catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      {showImageModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}
        onClick={() => setShowImageModal(false)}
        >
          <div style={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh"
          }}>
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "32px",
                cursor: "pointer",
                zIndex: 1001
              }}
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={neumatico.imagen || "/images/placeholder-tire.png"}
              alt={neumatico.nombre}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "16px"
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
} 