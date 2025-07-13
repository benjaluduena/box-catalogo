"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout.jsx";
import { supabase } from "../../../lib/supabaseClient";
import NeumaticosPorMarca from '../../../components/NeumaticosPorMarca.jsx';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  useEffect(() => {
    fetchMarcas();
  }, []);

  async function fetchMarcas() {
    const { data, error } = await supabase
      .from("marcas")
      .select("*")
      .order("nombre");
    
    if (!error) {
      setMarcas(data || []);
    }
    setLoading(false);
  }

  async function agregarMarca() {
    if (!nuevaMarca.trim()) return;
    
    const { error } = await supabase
      .from("marcas")
      .insert([{ nombre: nuevaMarca.trim() }]);
    
    if (!error) {
      setNuevaMarca("");
      fetchMarcas();
    }
  }

  async function eliminarMarca(id) {
    const { error } = await supabase
      .from("marcas")
      .delete()
      .eq("id", id);
    
    if (!error) {
      fetchMarcas();
    }
  }

  async function actualizarMarca(id) {
    if (!editNombre.trim()) return;
    
    const { error } = await supabase
      .from("marcas")
      .update({ nombre: editNombre.trim() })
      .eq("id", id);
    
    if (!error) {
      setEditando(null);
      setEditNombre("");
      fetchMarcas();
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h1>Gestionar Marcas</h1>
        
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={nuevaMarca}
            onChange={(e) => setNuevaMarca(e.target.value)}
            placeholder="Nueva marca"
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <button onClick={agregarMarca} style={{ padding: "8px 16px" }}>
            Agregar
          </button>
        </div>

        <div>
          {marcas.map(marca => (
            <div key={marca.id} style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              {editando === marca.id ? (
                <>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    style={{ marginRight: "10px", padding: "8px" }}
                  />
                  <button onClick={() => actualizarMarca(marca.id)} style={{ marginRight: "5px", padding: "4px 8px" }}>
                    Guardar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ padding: "4px 8px" }}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{marca.nombre}</span>
                  <button onClick={() => {
                    setEditando(marca.id);
                    setEditNombre(marca.nombre);
                  }} style={{ marginRight: "5px", padding: "4px 8px" }}>
                    Editar
                  </button>
                  <button onClick={() => eliminarMarca(marca.id)} style={{ padding: "4px 8px" }}>
                    Eliminar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {editando && (
          <div style={{ marginTop: "20px" }}>
            <h3>Neumáticos de esta marca</h3>
            <NeumaticosPorMarca marcaId={editando} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 