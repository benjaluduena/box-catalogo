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
      {/* Botón flotante y panel admin eliminados */}
    </>
  );
}

export default AdminPanel; 