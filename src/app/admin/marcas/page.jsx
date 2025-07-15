"use client";
import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { supabase } from "../../../lib/supabaseClient";
import NeumaticosPorMarca from '../../../components/NeumaticosPorMarca';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", logo: "" });
  const [message, setMessage] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [expandedMarcaId, setExpandedMarcaId] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchMarcas();
  }, []);

  async function fetchMarcas() {
    try {
      const { data, error } = await supabase
        .from("marcas")
        .select("*")
        .order("nombre");
      
      if (error) throw error;
      setMarcas(data || []);
    } catch (error) {
      console.error("Error fetching marcas:", error);
      setMessage("Error al cargar las marcas");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        // Actualizar marca existente
        const { error } = await supabase
          .from("marcas")
          .update(formData)
          .eq("id", editingId);
        
        if (error) throw error;
        setMessage("Marca actualizada correctamente");
      } else {
        // Crear nueva marca
        const { error } = await supabase
          .from("marcas")
          .insert(formData);
        
        if (error) throw error;
        setMessage("Marca creada correctamente");
      }

      setFormData({ nombre: "", logo: "" });
      setEditingId(null);
      setShowForm(false);
      fetchMarcas();
    } catch (error) {
      console.error("Error saving marca:", error);
      setMessage("Error al guardar la marca");
    }
  };

  const handleEdit = (marca) => {
    setFormData({ nombre: marca.nombre, logo: marca.logo || "" });
    setEditingId(marca.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta marca?")) return;

    try {
      const { error } = await supabase
        .from("marcas")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setMessage("Marca eliminada correctamente");
      fetchMarcas();
    } catch (error) {
      console.error("Error deleting marca:", error);
      setMessage("Error al eliminar la marca");
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: "", logo: "" });
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  };

  // Funciones faltantes para upload de logo
  const handleLogoUpload = async (file) => {
    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("marcas")
        .upload(fileName, file);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from("marcas")
        .getPublicUrl(fileName);
      setFormData({ ...formData, logo: publicUrlData.publicUrl });
      setMessage("Logo subido correctamente");
    } catch (error) {
      console.error("Error uploading logo:", error);
      setMessage("Error al subir el logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDropLogo = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleLogoUpload(file);
    }
  };

  const handleDragOverLogo = (e) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <style>{`
          @media (max-width: 700px) {
            .titulo-admin-neumaticos {
              padding-left: 54px !important;
            }
          }
        `}</style>
      <div>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h1 className="titulo-admin-neumaticos" style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#0ea5e9"
            }}>
              Gestión de Marcas
            </h1>
          </div>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Administra las marcas de neumáticos disponibles
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
              {editingId ? "Editar Marca" : "Nueva Marca"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b"
                }}>
                  Nombre de la Marca *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e0f2fe",
                    fontSize: "16px"
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b"
                }}>
                  Logo
                </label>
                <div
                  onDrop={handleDropLogo}
                  onDragOver={handleDragOverLogo}
                  style={{
                    border: "2px dashed #e0f2fe",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    background: uploadingLogo ? "#f3f4f6" : "#f8fafc",
                    cursor: "pointer"
                  }}
                >
                  {uploadingLogo ? (
                    <div style={{ color: "#64748b" }}>Subiendo logo...</div>
                  ) : formData.logo ? (
                    <div>
                      <img
                        src={formData.logo}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "120px",
                          objectFit: "contain",
                          marginBottom: "8px"
                        }}
                      />
                      <div style={{ color: "#64748b", fontSize: "14px" }}>
                        Arrastra un nuevo logo o usa el botón para seleccionar archivo
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: "#64748b" }}>
                      Arrastra y suelta un logo aquí o usa el botón para seleccionar archivo
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
                    <i className="fas fa-image"></i> Seleccionar logo...
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) handleLogoUpload(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #10b981, #34d399)",
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
                  onClick={handleCancel}
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

        {editingId && (
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0ea5e9", marginBottom: "12px" }}>
              Neumáticos de esta Marca
            </h3>
            <NeumaticosPorMarca marcaId={editingId} />
          </div>
        )}

        {/* Bloque de Marcas Existentes */}
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
              Marcas Existentes
            </h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nombre: "", logo: "" }); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700 }}>➕</span> Nueva Marca
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              Cargando marcas...
            </div>
          ) : marcas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No hay marcas registradas
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px"
            }}>
              {marcas.map((marca) => (
                <div
                  key={marca.id}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e0f2fe",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    cursor: "pointer",
                    position: "relative"
                  }}
                  onClick={e => {
                    // Evitar que el click en los botones Editar/Eliminar dispare el toggle
                    if (e.target.closest('button')) return;
                    setExpandedMarcaId(expandedMarcaId === marca.id ? null : marca.id);
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1e293b"
                    }}>
                      {marca.nombre}
                    </h3>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={e => { e.stopPropagation(); handleEdit(marca); }}
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
                        onClick={e => { e.stopPropagation(); handleDelete(marca.id); }}
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
                  {marca.logo && (
                    <div style={{ marginTop: "8px" }}>
                      <img
                        src={marca.logo}
                        alt={`Logo ${marca.nombre}`}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "60px",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  )}
                  {expandedMarcaId === marca.id && (
                    <div
                      style={{
                        marginTop: 16,
                        width: '100%',
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '0',
                        boxSizing: 'border-box',
                        boxShadow: 'none',
                        border: 'none',
                      }}
                    >
                      <NeumaticosPorMarca marcaId={marca.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 