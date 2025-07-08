"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminPanel() {
  const [open, setOpen] = useState(false);
  // Marca
  const [marca, setMarca] = useState("");
  const [logo, setLogo] = useState("");
  // Neumático
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [imagen, setImagen] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [uploading, setUploading] = useState(false);

  // Cargar marcas para el select
  async function fetchMarcas() {
    const { data } = await supabase.from("marcas").select("id, nombre");
    setMarcas(data || []);
  }

  // Mostrar marcas al abrir
  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) fetchMarcas();
  };

  // Agregar marca
  async function handleMarca(e) {
    e.preventDefault();
    const { error } = await supabase.from("marcas").insert({ nombre: marca, logo });
    setMensaje(error ? "Error al guardar marca" : "Marca guardada");
    setMarca("");
    setLogo("");
    fetchMarcas();
  }

  // Agregar neumático
  async function handleNeumatico(e) {
    e.preventDefault();
    const { error } = await supabase.from("neumaticos").insert({
      nombre,
      descripcion,
      precio: parseFloat(precio),
      tipo,
      marca_id: marcaId ? parseInt(marcaId) : null,
      imagen,
    });
    setMensaje(error ? "Error al guardar neumático" : "Neumático guardado");
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setTipo("");
    setMarcaId("");
    setImagen("");
  }

  // Subir imagen a Supabase Storage
  async function handleImageUpload(file) {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from("neumaticos").upload(fileName, file);
    if (error) {
      setMensaje("Error al subir imagen");
      setUploading(false);
      return;
    }
    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage.from("neumaticos").getPublicUrl(fileName);
    setImagen(publicUrlData.publicUrl);
    setUploading(false);
    setMensaje("Imagen subida correctamente");
  }

  // Drag & drop handlers
  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: "#222",
          color: "#fff",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 28,
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
        title="Panel Admin"
      >
        ⚙️
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            zIndex: 1001,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            padding: 24,
            minWidth: 320,
            maxWidth: 360,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Panel Admin</h3>
          <form onSubmit={handleMarca} style={{ marginBottom: 18 }}>
            <b>Agregar Marca</b>
            <input
              type="text"
              placeholder="Nombre de marca"
              value={marca}
              onChange={e => setMarca(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
              required
            />
            <input
              type="text"
              placeholder="Logo (opcional)"
              value={logo}
              onChange={e => setLogo(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
            />
            <button type="submit" style={{ width: "100%", marginTop: 6 }}>Guardar Marca</button>
          </form>
          <form onSubmit={handleNeumatico}>
            <b>Agregar Neumático</b>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
            />
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
              required
            />
            <input
              type="text"
              placeholder="Tipo (auto, camioneta, etc)"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
            />
            <select
              value={marcaId}
              onChange={e => setMarcaId(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
            >
              <option value="">Selecciona marca</option>
              {marcas.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            {/* Drag & Drop para imagen */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: "2px dashed #aaa",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
                margin: "8px 0",
                background: uploading ? "#f3f3f3" : "#fafafa",
                color: uploading ? "#888" : "#222",
                cursor: "pointer"
              }}
            >
              {uploading ? "Subiendo imagen..." : imagen ? (
                <img src={imagen} alt="Imagen subida" style={{ maxWidth: 80, maxHeight: 80, margin: "0 auto" }} />
              ) : (
                "Arrastra y suelta una imagen aquí"
              )}
            </div>
            <input
              type="text"
              placeholder="Imagen (URL o nombre de archivo)"
              value={imagen}
              onChange={e => setImagen(e.target.value)}
              style={{ width: "100%", margin: "6px 0" }}
            />
            <button type="submit" style={{ width: "100%", marginTop: 6 }}>Guardar Neumático</button>
          </form>
          {mensaje && <div style={{ marginTop: 10, color: "#22c55e" }}>{mensaje}</div>}
        </div>
      )}
    </>
  );
}

export default AdminPanel; 