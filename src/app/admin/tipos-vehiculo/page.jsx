"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { supabase } from "../../../lib/supabaseClient";
import NeumaticosPorTipo from "./neumaticos-por-tipo";

export default function TiposVehiculoPage() {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: "" });
  const [message, setMessage] = useState("");
  const [expandedTipoId, setExpandedTipoId] = useState(null);

  useEffect(() => {
    fetchTiposVehiculo();
  }, []);

  async function fetchTiposVehiculo() {
    try {
      const { data, error } = await supabase
        .from("tipos_vehiculo")
        .select("*")
        .order("nombre");
      
      if (error) throw error;
      setTiposVehiculo(data || []);
    } catch (error) {
      console.error("Error fetching tipos_vehiculo:", error);
      setMessage("Error al cargar los tipos de vehículo");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        // Actualizar tipo existente
        const { error } = await supabase
          .from("tipos_vehiculo")
          .update(formData)
          .eq("id", editingId);
        
        if (error) throw error;
        setMessage("Tipo de vehículo actualizado correctamente");
      } else {
        // Crear nuevo tipo
        const { error } = await supabase
          .from("tipos_vehiculo")
          .insert(formData);
        
        if (error) throw error;
        setMessage("Tipo de vehículo creado correctamente");
      }

      setFormData({ nombre: "" });
      setEditingId(null);
      setShowForm(false);
      fetchTiposVehiculo();
    } catch (error) {
      console.error("Error saving tipo_vehiculo:", error);
      setMessage("Error al guardar el tipo de vehículo");
    }
  };

  const handleEdit = (tipo) => {
    setFormData({ nombre: tipo.nombre });
    setEditingId(tipo.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este tipo de vehículo?")) return;

    setMessage("");
    try {
      // Verificar si existen neumáticos asociados a este tipo
      const { data: neumaticosAsociados, error: errorCheck } = await supabase
        .from("neumaticos")
        .select("id")
        .eq("tipo_id", id);
      if (errorCheck) throw errorCheck;
      if (neumaticosAsociados && neumaticosAsociados.length > 0) {
        setMessage("No se puede eliminar este tipo de vehículo porque existen neumáticos asociados. Elimina o reasigna esos neumáticos antes de intentar borrar el tipo.");
        return;
      }
      // Si no hay neumáticos asociados, proceder con el borrado
      const { error } = await supabase
        .from("tipos_vehiculo")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setMessage("Tipo de vehículo eliminado correctamente");
      fetchTiposVehiculo();
    } catch (error) {
      console.error("Error deleting tipo_vehiculo:", error, error?.message, error?.details, JSON.stringify(error, null, 2));
      setMessage("Error al eliminar el tipo de vehículo");
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: "" });
    setEditingId(null);
    setShowForm(false);
    setMessage("");
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
              Tipos de Vehículo
            </h1>
          </div>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Administra los tipos de vehículo para categorizar neumáticos
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
              {editingId ? "Editar Tipo de Vehículo" : "Nuevo Tipo de Vehículo"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b"
                }}>
                  Nombre del Tipo *
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
                  placeholder="Ej: Auto, Camioneta, Camión, Moto"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
              Neumáticos de este Tipo de Vehículo
            </h3>
            <NeumaticosPorTipo tipoId={editingId} />
          </div>
        )}

        {/* Bloque de Tipos de Vehículo Existentes */}
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
              Tipos de Vehículo Existentes
            </h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData({ nombre: "" }); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(245,158,11,0.08)",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700 }}>➕</span> Nuevo Tipo
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              Cargando tipos de vehículo...
            </div>
          ) : tiposVehiculo.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No hay tipos de vehículo registrados
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              {tiposVehiculo.map((tipo) => (
                <div
                  key={tipo.id}
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
                    position: "relative",
                    minWidth: 250,
                    maxWidth: 340,
                    flex: '1 1 250px',
                    boxSizing: 'border-box',
                  }}
                  onClick={e => {
                    // Evitar que el click en los botones Editar/Eliminar dispare el toggle
                    if (e.target.closest('button')) return;
                    setExpandedTipoId(expandedTipoId === tipo.id ? null : tipo.id);
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1e293b"
                    }}>
                      {tipo.nombre}
                    </h3>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={e => { e.stopPropagation(); handleEdit(tipo); }}
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
                        onClick={e => { e.stopPropagation(); handleDelete(tipo.id); }}
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
                  {expandedTipoId === tipo.id && (
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
                      <NeumaticosPorTipo tipoId={tipo.id} />
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