"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout.jsx";
import { supabase } from "../../../lib/supabaseClient";
import MedidasInline from '../../../components/MedidasInline.jsx';

export default function NeumaticosPage() {
  const [neumaticos, setNeumaticos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_anterior: "",
    imagen: "",
    marca_id: "",
    tipo_id: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [neumaticosRes, marcasRes, tiposRes] = await Promise.all([
      supabase.from("neumaticos").select("*, marcas(nombre), tipos_vehiculo(nombre)").order("id"),
      supabase.from("marcas").select("*").order("nombre"),
      supabase.from("tipos_vehiculo").select("*").order("nombre")
    ]);

    if (!neumaticosRes.error) setNeumaticos(neumaticosRes.data || []);
    if (!marcasRes.error) setMarcas(marcasRes.data || []);
    if (!tiposRes.error) setTiposVehiculo(tiposRes.data || []);
    
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSubmit = {
      ...formData,
      precio: parseFloat(formData.precio),
      precio_anterior: formData.precio_anterior ? parseFloat(formData.precio_anterior) : null,
      marca_id: parseInt(formData.marca_id),
      tipo_id: parseInt(formData.tipo_id)
    };

    if (editingId) {
      const { error } = await supabase
        .from("neumaticos")
        .update(dataToSubmit)
        .eq("id", editingId);
      
      if (!error) {
        setEditingId(null);
        setShowForm(false);
        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          precio_anterior: "",
          imagen: "",
          marca_id: "",
          tipo_id: ""
        });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("neumaticos")
        .insert(dataToSubmit);
      
      if (!error) {
        setShowForm(false);
        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          precio_anterior: "",
          imagen: "",
          marca_id: "",
          tipo_id: ""
        });
        fetchData();
      }
    }
  };

  const handleEdit = (neumatico) => {
    setFormData({
      nombre: neumatico.nombre,
      descripcion: neumatico.descripcion,
      precio: neumatico.precio.toString(),
      precio_anterior: neumatico.precio_anterior ? neumatico.precio_anterior.toString() : "",
      imagen: neumatico.imagen || "",
      marca_id: neumatico.marca_id.toString(),
      tipo_id: neumatico.tipo_id.toString()
    });
    setEditingId(neumatico.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este neumático?")) {
      const { error } = await supabase
        .from("neumaticos")
        .delete()
        .eq("id", id);
      
      if (!error) {
        fetchData();
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h1>Gestionar Neumáticos</h1>
        
        <button 
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              nombre: "",
              descripcion: "",
              precio: "",
              precio_anterior: "",
              imagen: "",
              marca_id: "",
              tipo_id: ""
            });
          }}
          style={{ marginBottom: "20px", padding: "10px 20px" }}
        >
          Agregar Neumático
        </button>

        {showForm && (
          <div style={{ 
            background: "#f5f5f5", 
            padding: "20px", 
            marginBottom: "20px",
            borderRadius: "8px"
          }}>
            <h2>{editingId ? "Editar" : "Nuevo"} Neumático</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <label>Descripción:</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <label>Precio:</label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <label>Precio Anterior (opcional):</label>
                <input
                  type="number"
                  value={formData.precio_anterior}
                  onChange={(e) => setFormData({...formData, precio_anterior: e.target.value})}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <label>Imagen URL:</label>
                <input
                  type="url"
                  value={formData.imagen}
                  onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <label>Marca:</label>
                <select
                  value={formData.marca_id}
                  onChange={(e) => setFormData({...formData, marca_id: e.target.value})}
                  required
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">Seleccionar marca</option>
                  {marcas.map(marca => (
                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: "10px" }}>
                <label>Tipo de Vehículo:</label>
                <select
                  value={formData.tipo_id}
                  onChange={(e) => setFormData({...formData, tipo_id: e.target.value})}
                  required
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposVehiculo.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ padding: "8px 16px" }}>
                  {editingId ? "Actualizar" : "Crear"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  style={{ padding: "8px 16px" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          {neumaticos.map(neumatico => (
            <div key={neumatico.id} style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              marginBottom: "10px",
              borderRadius: "4px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{neumatico.nombre}</h3>
                  <p>{neumatico.descripcion}</p>
                  <p>Precio: ${neumatico.precio}</p>
                  <p>Marca: {neumatico.marcas?.nombre}</p>
                  <p>Tipo: {neumatico.tipos_vehiculo?.nombre}</p>
                </div>
                <div>
                  <button onClick={() => handleEdit(neumatico)} style={{ marginRight: "5px" }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(neumatico.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
              
              <MedidasInline neumaticoId={neumatico.id} />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
} 