"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";
import { supabase } from "../../../lib/supabaseClient";
import MedidasInline from '../../../components/MedidasInline';
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
    precio: "",
    precio_anterior: "",
    imagen: "",
    marca_id: "",
    tipo_id: "",
    mas_vendido: false,
    destacado: false
  });
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
      setMessage("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validationRules = {
      nombre: { type: 'text', options: { required: true, minLength: 2, maxLength: 100 } },
      precio: { type: 'price', options: { required: true } },
      descripcion: { type: 'text', options: { maxLength: 500 } },
      precio_anterior: { type: 'price', options: { required: false } }
    };

    const sanitizedData = {
      ...formData,
      nombre: sanitizeInput(formData.nombre),
      descripcion: sanitizeInput(formData.descripcion)
    };

    const validation = validateForm(sanitizedData, validationRules);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      const neumaticoData = {
        ...sanitizedData,
        precio: parseFloat(sanitizedData.precio),
        precio_anterior: sanitizedData.precio_anterior ? parseFloat(sanitizedData.precio_anterior) : null,
        marca_id: sanitizedData.marca_id ? parseInt(sanitizedData.marca_id) : null,
        tipo_id: sanitizedData.tipo_id ? parseInt(sanitizedData.tipo_id) : null
      };

      if (editingId) {
        const { error } = await supabase
          .from("neumaticos")
          .update(neumaticoData)
          .eq("id", editingId);
        
        if (error) throw error;
        setMessage("Neumático actualizado correctamente");
      } else {
        const { error } = await supabase
          .from("neumaticos")
          .insert(neumaticoData);
        
        if (error) throw error;
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

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleEdit = (neumatico) => {
    setFormData({
      nombre: neumatico.nombre,
      descripcion: neumatico.descripcion || "",
      precio: neumatico.precio?.toString() || "",
      precio_anterior: neumatico.precio_anterior?.toString() || "",
      imagen: neumatico.imagen || "",
      marca_id: neumatico.marca_id?.toString() || "",
      tipo_id: neumatico.tipo_id?.toString() || "",
      mas_vendido: neumatico.mas_vendido || false,
      destacado: neumatico.destacado || false
    });
    setEditingId(neumatico.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este neumático?")) return;

    try {
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

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      precio_anterior: "",
      imagen: "",
      marca_id: "",
      tipo_id: "",
      mas_vendido: false,
      destacado: false
    });
    setEditingId(null);
    setShowForm(false);
    setMessage("");
    setErrors({});
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#0ea5e9"
            }}>
              Gestión de Neumáticos
            </h1>
            {/* Eliminar el botón flotante de la cabecera general */}
            {/* <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nombre: "", descripcion: "", precio: "", precio_anterior: "", imagen: "", marca_id: "", tipo_id: "", mas_vendido: false, destacado: false }); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(14,165,233,0.08)",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 700 }}>➕</span> Nuevo Neumático
            </button> */}
          </div>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Administra el catálogo de neumáticos
          </p>
        </div>

        {message && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            background: message.includes("Error") ? "#fef2f2" : "#f0fdf4",
            color: message.includes("Error") ? "#dc2626" : "#16a34a",
            border: `1px solid ${message.includes("Error") ? "#fecaca" : "#bbf7d0"}`
          }}>
            {message}
          </div>
        )}

        {showForm && (
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e0f2fe"
          }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "16px"
            }}>
              {editingId ? "Editar Neumático" : "Nuevo Neumático"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `2px solid ${errors.nombre ? "#dc2626" : "#e0f2fe"}`,
                      fontSize: "16px"
                    }}
                    required
                  />
                  {errors.nombre && (
                    <div style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
                      {errors.nombre}
                    </div>
                  )}
                </div>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `2px solid ${errors.precio ? "#dc2626" : "#e0f2fe"}`,
                      fontSize: "16px"
                    }}
                    required
                  />
                  {errors.precio && (
                    <div style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
                      {errors.precio}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b"
                }}>
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e0f2fe",
                    fontSize: "16px",
                    minHeight: "80px",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Marca
                  </label>
                  <select
                    value={formData.marca_id}
                    onChange={(e) => setFormData({ ...formData, marca_id: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0f2fe",
                      fontSize: "16px"
                    }}
                  >
                    <option value="">Seleccionar marca</option>
                    {marcas.map(marca => (
                      <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Tipo de Vehículo
                  </label>
                  <select
                    value={formData.tipo_id}
                    onChange={(e) => setFormData({ ...formData, tipo_id: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0f2fe",
                      fontSize: "16px"
                    }}
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposVehiculo.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Precio Anterior
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_anterior}
                    onChange={(e) => setFormData({ ...formData, precio_anterior: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0f2fe",
                      fontSize: "16px"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.mas_vendido}
                    onChange={(e) => setFormData({ ...formData, mas_vendido: e.target.checked })}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>Más Vendido</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>Destacado</span>
                </label>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b"
                }}>
                  Imagen
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{
                    border: "2px dashed #e0f2fe",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    background: uploading ? "#f3f4f6" : "#f8fafc",
                    cursor: "pointer"
                  }}
                >
                  {uploading ? (
                    <div style={{ color: "#64748b" }}>Subiendo imagen...</div>
                  ) : formData.imagen ? (
                    <div>
                      <img
                        src={formData.imagen}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "120px",
                          objectFit: "contain",
                          marginBottom: "8px"
                        }}
                      />
                      <div style={{ color: "#64748b", fontSize: "14px" }}>
                        Arrastra una nueva imagen o usa el botón para seleccionar archivo
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: "#64748b" }}>
                      Arrastra y suelta una imagen aquí o usa el botón para seleccionar archivo
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{
                      marginTop: 12,
                      padding: "12px 24px",
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <i className="fas fa-image"></i> Seleccionar imagen...
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "12px 24px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0ea5e9", marginBottom: "12px" }}>
            Medidas del Neumático
          </h3>
          {/* Listado y gestión inline de medidas asociadas al neumático actual */}
          {/* Mostrar solo si editingId o si se acaba de crear un neumático */}
          {editingId && (
            <MedidasInline neumaticoId={editingId} />
          )}
        </div>

        {/* Bloque de Neumáticos Existentes */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0f2fe",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0
            }}>
              Neumáticos Existentes
            </h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nombre: "", descripcion: "", precio: "", precio_anterior: "", imagen: "", marca_id: "", tipo_id: "", mas_vendido: false, destacado: false }); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(14,165,233,0.08)",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700 }}>➕</span> Nuevo Neumático
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              Cargando neumáticos...
            </div>
          ) : neumaticos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No hay neumáticos registrados
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "16px"
            }}>
              {neumaticos.map((neumatico) => (
                <div
                  key={neumatico.id}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e0f2fe"
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    {neumatico.imagen && (
                      <img
                        src={neumatico.imagen}
                        alt={neumatico.nombre}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          background: "white"
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1e293b",
                        marginBottom: "4px"
                      }}>
                        {neumatico.nombre}
                      </h3>
                      <div style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
                        {neumatico.marcas?.nombre} • {neumatico.tipos_vehiculo?.nombre}
                      </div>
                      <div style={{ fontWeight: "700", color: "#0ea5e9", fontSize: "16px" }}>
                        ${neumatico.precio}
                        {neumatico.precio_anterior && (
                          <span style={{
                            textDecoration: "line-through",
                            color: "#94a3b8",
                            marginLeft: "8px",
                            fontWeight: "500"
                          }}>
                            ${neumatico.precio_anterior}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    {(neumatico.mas_vendido || neumatico.destacado) && (
                      <div style={{ display: "flex", gap: "4px" }}>
                        {neumatico.mas_vendido && (
                          <span style={{
                            background: "#fbbf24",
                            color: "#92400e",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            Más Vendido
                          </span>
                        )}
                        {neumatico.destacado && (
                          <span style={{
                            background: "#10b981",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            Destacado
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleEdit(neumatico)}
                      style={{
                        padding: "6px 12px",
                        background: "#e0f2fe",
                        color: "#0ea5e9",
                        border: "1px solid #bae6fd",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(neumatico.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 