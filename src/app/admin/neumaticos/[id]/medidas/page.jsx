"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../../../components/AdminLayout.jsx";
import { supabase } from "../../../../../lib/supabaseClient";

export default function MedidasPage({ params }) {
  const [medidas, setMedidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevaMedida, setNuevaMedida] = useState("");
  const [nuevoStock, setNuevoStock] = useState("");
  const [editando, setEditando] = useState(null);
  const [editMedida, setEditMedida] = useState("");
  const [editStock, setEditStock] = useState("");

  useEffect(() => {
    fetchMedidas();
  }, [params.id]);

  async function fetchMedidas() {
    const { data, error } = await supabase
      .from("medidas")
      .select("*")
      .eq("neumatico_id", params.id)
      .order("medida");
    
    if (!error) {
      setMedidas(data || []);
    }
    setLoading(false);
  }

  async function agregarMedida() {
    if (!nuevaMedida.trim() || !nuevoStock.trim()) return;
    
    const { error } = await supabase
      .from("medidas")
      .insert([{ 
        medida: nuevaMedida.trim(), 
        stock: parseInt(nuevoStock),
        neumatico_id: params.id
      }]);
    
    if (!error) {
      setNuevaMedida("");
      setNuevoStock("");
      fetchMedidas();
    }
  }

  async function eliminarMedida(id) {
    const { error } = await supabase
      .from("medidas")
      .delete()
      .eq("id", id);
    
    if (!error) {
      fetchMedidas();
    }
  }

  async function actualizarMedida(id) {
    if (!editMedida.trim() || !editStock.trim()) return;
    
    const { error } = await supabase
      .from("medidas")
      .update({ 
        medida: editMedida.trim(), 
        stock: parseInt(editStock)
      })
      .eq("id", id);
    
    if (!error) {
      setEditando(null);
      setEditMedida("");
      setEditStock("");
      fetchMedidas();
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h1>Gestionar Medidas del Neumático</h1>
        
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={nuevaMedida}
            onChange={(e) => setNuevaMedida(e.target.value)}
            placeholder="Nueva medida"
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <input
            type="number"
            value={nuevoStock}
            onChange={(e) => setNuevoStock(e.target.value)}
            placeholder="Stock"
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <button onClick={agregarMedida} style={{ padding: "8px 16px" }}>
            Agregar
          </button>
        </div>

        <div>
          {medidas.map(medida => (
            <div key={medida.id} style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              {editando === medida.id ? (
                <>
                  <input
                    type="text"
                    value={editMedida}
                    onChange={(e) => setEditMedida(e.target.value)}
                    style={{ marginRight: "10px", padding: "8px" }}
                  />
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    style={{ marginRight: "10px", padding: "8px" }}
                  />
                  <button onClick={() => actualizarMedida(medida.id)} style={{ marginRight: "5px", padding: "4px 8px" }}>
                    Guardar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ padding: "4px 8px" }}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{medida.medida}</span>
                  <span style={{ marginRight: "10px" }}>Stock: {medida.stock}</span>
                  <button onClick={() => {
                    setEditando(medida.id);
                    setEditMedida(medida.medida);
                    setEditStock(medida.stock.toString());
                  }} style={{ marginRight: "5px", padding: "4px 8px" }}>
                    Editar
                  </button>
                  <button onClick={() => eliminarMedida(medida.id)} style={{ padding: "4px 8px" }}>
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