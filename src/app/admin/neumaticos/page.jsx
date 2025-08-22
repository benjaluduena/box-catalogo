"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";
import { supabase } from "../../../lib/supabaseClient";
import { validateForm, sanitizeInput } from '../../../lib/validation';

export default function NeumaticosPage() {
  const [neumaticos, setNeumaticos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    marca_id: "",
    tipo_id: "",
    mas_vendido: false,
    destacado: false
  });
  const [medidas, setMedidas] = useState([{ medida: "" }]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  // Verificar si hay un parámetro edit en la URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && neumaticos.length > 0) {
      const neumaticoToEdit = neumaticos.find(n => n.id.toString() === editId);
      if (neumaticoToEdit) {
        handleEdit(neumaticoToEdit);
      }
    }
  }, [searchParams, neumaticos]);

  async function fetchData() {
    try {
      const [neumaticosRes, marcasRes, tiposRes] = await Promise.all([
        supabase
          .from("neumaticos")
          .select(`
            *,
            marcas(nombre),
            tipos_vehiculo(nombre)
          `)
          .order("created_at", { ascending: false }),
        supabase.from("marcas").select("*").order("nombre"),
        supabase.from("tipos_vehiculo").select("*").order("nombre")
      ]);

      setNeumaticos(neumaticosRes.data || []);
      setMarcas(marcasRes.data || []);
      setTiposVehiculo(tiposRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const sanitizedData = sanitizeInput(formData);
    const validation = validateForm(sanitizedData, ['nombre', 'descripcion', 'marca_id', 'tipo_id']);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      const neumaticoData = {
        ...sanitizedData,
        marca_id: sanitizedData.marca_id ? parseInt(sanitizedData.marca_id) : null,
        tipo_id: sanitizedData.tipo_id ? parseInt(sanitizedData.tipo_id) : null
      };

      // Validar que hay al menos una medida
      const medidasValidas = medidas.filter(m => m.medida.trim() !== "");
      if (medidasValidas.length === 0) {
        setErrors({ medidas: "Debe agregar al menos una medida" });
        return;
      }

      if (editingId) {
        // Actualizar neumático
        const { error } = await supabase
          .from("neumaticos")
          .update(neumaticoData)
          .eq("id", editingId);
        
        if (error) throw error;

        // Eliminar medidas existentes y agregar las nuevas
        await supabase.from("medidas").delete().eq("neumatico_id", editingId);
        
        const { error: medidasError } = await supabase
          .from("medidas")
          .insert(medidasValidas.map(m => ({
            neumatico_id: editingId,
            medida: m.medida.trim()
          })));
        
        if (medidasError) throw medidasError;
        setMessage("Neumático actualizado correctamente");
      } else {
        // Crear nuevo neumático
        const { data: nuevoNeumatico, error } = await supabase
          .from("neumaticos")
          .insert(neumaticoData)
          .select()
          .single();
        
        if (error) throw error;

        // Agregar medidas
        const { error: medidasError } = await supabase
          .from("medidas")
          .insert(medidasValidas.map(m => ({
            neumatico_id: nuevoNeumatico.id,
            medida: m.medida.trim()
          })));
        
        if (medidasError) throw medidasError;
        setMessage("Neumático creado correctamente");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving neumatico:", error);
      setMessage("Error al guardar el neumático");
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from("neumaticos")
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from("neumaticos")
        .getPublicUrl(fileName);
      
      setFormData({ ...formData, imagen: publicUrlData.publicUrl });
      setMessage("Imagen subida correctamente");
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (neumatico) => {
    setFormData({
      nombre: neumatico.nombre,
      descripcion: neumatico.descripcion || "",
      imagen: neumatico.imagen || "",
      marca_id: neumatico.marca_id?.toString() || "",
      tipo_id: neumatico.tipo_id?.toString() || "",
      mas_vendido: neumatico.mas_vendido || false,
      destacado: neumatico.destacado || false
    });
    
    // Cargar medidas del neumático
    try {
      const { data: medidasData, error } = await supabase
        .from("medidas")
        .select("medida")
        .eq("neumatico_id", neumatico.id)
        .order("id");
      
      if (error) throw error;
      
      const medidasFormateadas = medidasData.length > 0 
        ? medidasData.map(m => ({ medida: m.medida }))
        : [{ medida: "" }];
      
      setMedidas(medidasFormateadas);
    } catch (error) {
      console.error("Error al cargar medidas:", error);
      setMedidas([{ medida: "" }]);
    }
    
    setEditingId(neumatico.id);
    setShowForm(true);
    setErrors({});
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este neumático?")) return;

    try {
      // Eliminar medidas primero
      await supabase.from("medidas").delete().eq("neumatico_id", id);
      
      // Eliminar neumático
      const { error } = await supabase
        .from("neumaticos")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setMessage("Neumático eliminado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error deleting neumatico:", error);
      setMessage("Error al eliminar el neumático");
    }
  };

  // Funciones para manejar medidas
  const addMedida = () => {
    setMedidas([...medidas, { medida: "" }]);
  };

  const removeMedida = (index) => {
    if (medidas.length > 1) {
      const newMedidas = medidas.filter((_, i) => i !== index);
      setMedidas(newMedidas);
    }
  };

  const updateMedida = (index, value) => {
    const newMedidas = [...medidas];
    newMedidas[index].medida = value;
    setMedidas(newMedidas);
  };

  const resetForm = (hideForm = true) => {
    setFormData({
      nombre: "",
      descripcion: "",
      imagen: "",
      marca_id: "",
      tipo_id: "",
      mas_vendido: false,
      destacado: false
    });
    setMedidas([{ medida: "" }]);
    setEditingId(null);
    if (hideForm) {
      setShowForm(false);
    }
    setMessage("");
    setErrors({});
  };

  if (loading) return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ color: "#0ea5e9", fontSize: "18px" }}>Cargando...</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "32px",
          padding: "24px 0",
          borderBottom: "2px solid #e0f2fe"
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "800",
            color: "#0ea5e9",
            margin: 0
          }}>
            🛞 Gestión de Neumáticos
          </h1>
          <button
            onClick={() => { 
              
              resetForm(false); 
              setShowForm(true);
              
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(14,165,233,0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            <i className="fas fa-plus"></i>
            Nuevo Neumático
          </button>
        </div>

        {/* Mensaje */}
        {message && (
          <div style={{
            padding: "16px 20px",
            marginBottom: "24px",
            borderRadius: "12px",
            background: message.includes("Error") ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${message.includes("Error") ? "#fecaca" : "#bbf7d0"}`,
            color: message.includes("Error") ? "#dc2626" : "#16a34a",
            fontWeight: "600"
          }}>
            <i className={`fas ${message.includes("Error") ? "fa-exclamation-circle" : "fa-check-circle"}`} style={{ marginRight: "8px" }}></i>
            {message}
          </div>
        )}

        {/* Lista de Neumáticos */}
        {!showForm && (
          <div style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(14, 165, 233, 0.1)",
            border: "1px solid #e0f2fe",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "24px 32px",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              borderBottom: "1px solid #e0f2fe"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#0ea5e9",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <i className="fas fa-list"></i>
                Neumáticos Registrados ({neumaticos.length})
              </h2>
            </div>
            
            <div style={{ padding: "0" }}>
              {neumaticos.length === 0 ? (
                <div style={{
                  padding: "64px 32px",
                  textAlign: "center",
                  color: "#64748b"
                }}>
                  <i className="fas fa-tire" style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}></i>
                  <p style={{ fontSize: "18px", margin: 0 }}>No hay neumáticos registrados</p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "24px",
                  padding: "32px"
                }}>
                  {neumaticos.map((neumatico) => (
                    <div
                      key={neumatico.id}
                      style={{
                        background: "white",
                        border: "2px solid #e0f2fe",
                        borderRadius: "16px",
                        padding: "24px",
                        transition: "all 0.3s ease",
                        position: "relative"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "#0ea5e9";
                        e.target.style.transform = "translateY(-4px)";
                        e.target.style.boxShadow = "0 12px 32px rgba(14, 165, 233, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "#e0f2fe";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      {/* Badges */}
                      <div style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        display: "flex",
                        gap: "8px"
                      }}>
                        {neumatico.destacado && (
                          <span style={{
                            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700"
                          }}>
                            ⭐ DESTACADO
                          </span>
                        )}
                        {neumatico.mas_vendido && (
                          <span style={{
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700"
                          }}>
                            🔥 MÁS VENDIDO
                          </span>
                        )}
                      </div>

                      {/* Imagen */}
                      <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                        border: "2px solid #e2e8f0"
                      }}>
                        {neumatico.imagen ? (
                          <img
                            src={neumatico.imagen}
                            alt={neumatico.nombre}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "10px"
                            }}
                          />
                        ) : (
                          <i className="fas fa-tire" style={{ color: "#cbd5e1", fontSize: "32px" }}></i>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ marginBottom: "20px" }}>
                        <h3 style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#1e293b",
                          margin: "0 0 8px 0",
                          lineHeight: "1.2"
                        }}>
                          {neumatico.nombre}
                        </h3>
                        <p style={{
                          color: "#64748b",
                          fontSize: "14px",
                          margin: "0 0 12px 0",
                          lineHeight: "1.4"
                        }}>
                          {neumatico.descripcion}
                        </p>
                        <div style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "14px"
                        }}>
                          <span style={{
                            color: "#0ea5e9",
                            fontWeight: "600"
                          }}>
                            <i className="fas fa-tag" style={{ marginRight: "6px" }}></i>
                            {neumatico.marcas?.nombre || "Sin marca"}
                          </span>
                          <span style={{
                            color: "#16a34a",
                            fontWeight: "600"
                          }}>
                            <i className="fas fa-car" style={{ marginRight: "6px" }}></i>
                            {neumatico.tipos_vehiculo?.nombre || "Sin tipo"}
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div style={{
                        display: "flex",
                        gap: "12px"
                      }}>
                        <button
                          onClick={() => handleEdit(neumatico)}
                          style={{
                            flex: 1,
                            padding: "12px",
                            background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                          <i className="fas fa-edit" style={{ marginRight: "8px" }}></i>
                          Editar
                        </button>
                        <button
                          onClick={() => router.push(`/admin/neumaticos/${neumatico.id}/medidas`)}
                          style={{
                            flex: 1,
                            padding: "12px",
                            background: "linear-gradient(135deg, #16a34a, #059669)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                          <i className="fas fa-ruler" style={{ marginRight: "8px" }}></i>
                          Medidas
                        </button>
                        <button
                          onClick={() => handleDelete(neumatico.id)}
                          style={{
                            padding: "12px 16px",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(14, 165, 233, 0.1)",
            border: "1px solid #e0f2fe",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "24px 32px",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              borderBottom: "1px solid #e0f2fe",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#0ea5e9",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <i className={`fas ${editingId ? "fa-edit" : "fa-plus"}`}></i>
                {editingId ? "Editar Neumático" : "Nuevo Neumático"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  border: "2px solid #0ea5e9",
                  borderRadius: "8px",
                  color: "#0ea5e9",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#0ea5e9";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#0ea5e9";
                }}
              >
                <i className="fas fa-times" style={{ marginRight: "6px" }}></i>
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "32px"
              }}>
                {/* Nombre */}
                <div>
                  <label style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-tire" style={{ marginRight: "8px", color: "#0ea5e9" }}></i>
                    Nombre del Neumático *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${errors.nombre ? "#ef4444" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      fontSize: "16px",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                    onBlur={(e) => e.target.style.borderColor = errors.nombre ? "#ef4444" : "#e2e8f0"}
                    placeholder="Ej: Michelin Energy XM2"
                  />
                  {errors.nombre && (
                    <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Marca */}
                <div>
                  <label style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-tag" style={{ marginRight: "8px", color: "#0ea5e9" }}></i>
                    Marca *
                  </label>
                  <select
                    value={formData.marca_id}
                    onChange={(e) => setFormData({ ...formData, marca_id: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${errors.marca_id ? "#ef4444" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      fontSize: "16px",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                      background: "white"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                    onBlur={(e) => e.target.style.borderColor = errors.marca_id ? "#ef4444" : "#e2e8f0"}
                  >
                    <option value="">Seleccionar marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.marca_id && (
                    <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>
                      {errors.marca_id}
                    </p>
                  )}
                </div>

                {/* Tipo de Vehículo */}
                <div>
                  <label style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-car" style={{ marginRight: "8px", color: "#0ea5e9" }}></i>
                    Tipo de Vehículo *
                  </label>
                  <select
                    value={formData.tipo_id}
                    onChange={(e) => setFormData({ ...formData, tipo_id: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${errors.tipo_id ? "#ef4444" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      fontSize: "16px",
                      transition: "border-color 0.2s ease",
                      boxSizing: "border-box",
                      background: "white"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                    onBlur={(e) => e.target.style.borderColor = errors.tipo_id ? "#ef4444" : "#e2e8f0"}
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposVehiculo.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.tipo_id && (
                    <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>
                      {errors.tipo_id}
                    </p>
                  )}
                </div>

                {/* Imagen */}
                <div>
                  <label style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-image" style={{ marginRight: "8px", color: "#0ea5e9" }}></i>
                    Imagen
                  </label>
                  <div style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    background: formData.imagen ? "#f0fdf4" : "#f8fafc",
                    transition: "all 0.2s ease"
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleImageUpload(file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  >
                    {formData.imagen ? (
                      <div>
                        <img
                          src={formData.imagen}
                          alt="Preview"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            marginBottom: "8px"
                          }}
                        />
                        <p style={{ color: "#16a34a", fontSize: "14px", margin: 0 }}>
                          ✅ Imagen cargada
                        </p>
                      </div>
                    ) : (
                      <div>
                        <i className="fas fa-cloud-upload-alt" style={{
                          fontSize: "32px",
                          color: "#cbd5e1",
                          marginBottom: "8px"
                        }}></i>
                        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                          Arrastra una imagen aquí o 
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleImageUpload(file);
                            }}
                            style={{ display: "none" }}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#0ea5e9",
                              textDecoration: "underline",
                              cursor: "pointer",
                              marginLeft: "4px"
                            }}
                          >
                            selecciona un archivo
                          </button>
                        </p>
                      </div>
                    )}
                    {uploading && (
                      <p style={{ color: "#0ea5e9", fontSize: "14px", margin: "8px 0 0 0" }}>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                        Subiendo imagen...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  <i className="fas fa-align-left" style={{ marginRight: "8px", color: "#0ea5e9" }}></i>
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `2px solid ${errors.descripcion ? "#ef4444" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    fontSize: "16px",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                  onBlur={(e) => e.target.style.borderColor = errors.descripcion ? "#ef4444" : "#e2e8f0"}
                  placeholder="Describe las características del neumático..."
                />
                {errors.descripcion && (
                  <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>
                    {errors.descripcion}
                  </p>
                )}
              </div>

              {/* Medidas */}
              <div style={{ marginBottom: "32px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px"
                }}>
                  <label style={{
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "14px"
                  }}>
                    <i className="fas fa-ruler" style={{ marginRight: "8px", color: "#0ea5e9" }}></i>
                    Medidas Disponibles *
                  </label>
                  <button
                    type="button"
                    onClick={addMedida}
                    style={{
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #16a34a, #059669)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  >
                    <i className="fas fa-plus" style={{ marginRight: "6px" }}></i>
                    Agregar Medida
                  </button>
                </div>
                
                <div style={{
                  display: "grid",
                  gap: "12px"
                }}>
                  {medidas.map((medida, index) => (
                    <div key={index} style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      padding: "16px",
                      border: "2px solid #e0f2fe",
                      borderRadius: "10px",
                      background: "#f8fafc"
                    }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={medida.medida}
                          onChange={(e) => updateMedida(index, e.target.value)}
                          placeholder="Ej: 185/65 R15"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            boxSizing: "border-box"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                      {medidas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedida(index)}
                          style={{
                            padding: "10px 12px",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.medidas && (
                  <p style={{ color: "#ef4444", fontSize: "12px", margin: "8px 0 0 0" }}>
                    <i className="fas fa-exclamation-circle" style={{ marginRight: "6px" }}></i>
                    {errors.medidas}
                  </p>
                )}
              </div>

              {/* Opciones adicionales */}
              <div style={{
                display: "flex",
                gap: "24px",
                marginBottom: "32px",
                padding: "20px",
                background: "#f0f9ff",
                borderRadius: "12px",
                border: "1px solid #e0f2fe"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#374151"
                }}>
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#0ea5e9"
                    }}
                  />
                  <i className="fas fa-star" style={{ color: "#fbbf24" }}></i>
                  Producto Destacado
                </label>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#374151"
                }}>
                  <input
                    type="checkbox"
                    checked={formData.mas_vendido}
                    onChange={(e) => setFormData({ ...formData, mas_vendido: e.target.checked })}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#0ea5e9"
                    }}
                  />
                  <i className="fas fa-fire" style={{ color: "#ef4444" }}></i>
                  Más Vendido
                </label>
              </div>

              {/* Botones de acción */}
              <div style={{
                display: "flex",
                gap: "16px",
                justifyContent: "flex-end",
                borderTop: "1px solid #e0f2fe",
                paddingTop: "24px"
              }}>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  style={{
                    padding: "14px 28px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#e2e8f0";
                    e.target.style.color = "#1e293b";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#f1f5f9";
                    e.target.style.color = "#64748b";
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: "8px" }}></i>
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "16px",
                    boxShadow: "0 4px 16px rgba(14,165,233,0.3)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  <i className={`fas ${editingId ? "fa-save" : "fa-plus"}`} style={{ marginRight: "8px" }}></i>
                  {editingId ? "Actualizar Neumático" : "Crear Neumático"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}