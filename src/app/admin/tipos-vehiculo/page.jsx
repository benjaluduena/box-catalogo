"use client";
import AdminLayout from "../../../components/AdminLayout.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function TiposVehiculoPage() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  useEffect(() => {
    fetchTipos();
  }, []);

  async function fetchTipos() {
    const { data, error } = await supabase
      .from("tipos_vehiculo")
      .select("*")
      .order("nombre");
    
    if (!error) {
      setTipos(data || []);
    }
    setLoading(false);
  }

  async function agregarTipo() {
    if (!nuevoTipo.trim()) return;
    
    const { error } = await supabase
      .from("tipos_vehiculo")
      .insert([{ nombre: nuevoTipo.trim() }]);
    
    if (!error) {
      setNuevoTipo("");
      fetchTipos();
    }
  }

  async function eliminarTipo(id) {
    const { error } = await supabase
      .from("tipos_vehiculo")
      .delete()
      .eq("id", id);
    
    if (!error) {
      fetchTipos();
    }
  }

  async function actualizarTipo(id) {
    if (!editNombre.trim()) return;
    
    const { error } = await supabase
      .from("tipos_vehiculo")
      .update({ nombre: editNombre.trim() })
      .eq("id", id);
    
    if (!error) {
      setEditando(null);
      setEditNombre("");
      fetchTipos();
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h1>Gestionar Tipos de Vehículo</h1>
        
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={nuevoTipo}
            onChange={(e) => setNuevoTipo(e.target.value)}
            placeholder="Nuevo tipo de vehículo"
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <button onClick={agregarTipo} style={{ padding: "8px 16px" }}>
            Agregar
          </button>
        </div>

        <div>
          {tipos.map(tipo => (
            <div key={tipo.id} style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              {editando === tipo.id ? (
                <>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    style={{ marginRight: "10px", padding: "8px" }}
                  />
                  <button onClick={() => actualizarTipo(tipo.id)} style={{ marginRight: "5px", padding: "4px 8px" }}>
                    Guardar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ padding: "4px 8px" }}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{tipo.nombre}</span>
                  <button onClick={() => {
                    setEditando(tipo.id);
                    setEditNombre(tipo.nombre);
                  }} style={{ marginRight: "5px", padding: "4px 8px" }}>
                    Editar
                  </button>
                  <button onClick={() => eliminarTipo(tipo.id)} style={{ padding: "4px 8px" }}>
                    Eliminar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
} 