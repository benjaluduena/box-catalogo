"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../../../components/AdminLayout";
import { supabase } from "../../../../../lib/supabaseClient";

export default function MedidasPage() {
  const { id } = useParams();
  const router = useRouter();
  const [neumatico, setNeumatico] = useState(null);
  const [medidas, setMedidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ medida: "", stock: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const [neumaticoRes, medidasRes] = await Promise.all([
        supabase
          .from("neumaticos")
          .select("id, nombre")
          .eq("id", id)
          .single(),
        supabase
          .from("medidas")
          .select("*")
          .eq("neumatico_id", id)
          .order("medida")
      ]);

      if (neumaticoRes.error) throw neumaticoRes.error;
      if (medidasRes.error) throw medidasRes.error;

      setNeumatico(neumaticoRes.data);
      setMedidas(medidasRes.data || []);
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

    try {
      const medidaData = {
        ...formData,
        neumatico_id: parseInt(id),
        stock: parseInt(formData.stock)
      };

      if (editingId) {
        const { error } = await supabase
          .from("medidas")
          .update(medidaData)
          .eq("id", editingId);
        
        if (error) throw error;
        setMessage("Medida actualizada correctamente");
      } else {
        const { error } = await supabase
          .from("medidas")
          .insert(medidaData);
        
        if (error) throw error;
        setMessage("Medida creada correctamente");
      }

      setFormData({ medida: "", stock: "" });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Error saving medida:", error);
      setMessage("Error al guardar la medida");
    }
  };

  const handleEdit = (medida) => {
    setFormData({ medida: medida.medida, stock: medida.stock.toString() });
    setEditingId(medida.id);
    setShowForm(true);
  };

  const handleDelete = async (medidaId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta medida?")) return;

    try {
      const { error } = await supabase
        .from("medidas")
        .delete()
        .eq("id", medidaId);
      
      if (error) throw error;
      setMessage("Medida eliminada correctamente");
      fetchData();
    } catch (error) {
      console.error("Error deleting medida:", error);
      setMessage("Error al eliminar la medida");
    }
  };

  const handleCancel = () => {
    setFormData({ medida: "", stock: "" });
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Cargando...
        </div>
      </AdminLayout>
    );
  }

  if (!neumatico) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Neumático no encontrado
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <button
                onClick={() => router.back()}
                style={{
                  padding: "8px 16px",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "8px"
                }}
              >
                ← Volver
              </button>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#0ea5e9"
              }}>
                Medidas: {neumatico.nombre}
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              ➕ Nueva Medida
            </button>
          </div>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Administra las medidas disponibles para este neumático
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
              {editingId ? "Editar Medida" : "Nueva Medida"}
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
                    Medida *
                  </label>
                  <input
                    type="text"
                    value={formData.medida}
                    onChange={(e) => setFormData({ ...formData, medida: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0f2fe",
                      fontSize: "16px"
                    }}
                    placeholder="Ej: 205/55R16"
                    required
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
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

        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e0f2fe"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "16px"
          }}>
            Medidas Disponibles
          </h2>
          
          {medidas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              No hay medidas registradas para este neumático
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px"
            }}>
              {medidas.map((medida) => (
                <div
                  key={medida.id}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e0f2fe",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1e293b",
                      marginBottom: "4px"
                    }}>
                      {medida.medida}
                    </h3>
                    <div style={{
                      color: "#64748b",
                      fontSize: "14px"
                    }}>
                      Stock: <span style={{ fontWeight: "600", color: "#0ea5e9" }}>{medida.stock}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(medida)}
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
                      onClick={() => handleDelete(medida.id)}
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