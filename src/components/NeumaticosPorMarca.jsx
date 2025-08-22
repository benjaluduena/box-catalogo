import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NeumaticosPorMarca({ marcaId }) {
  const [neumaticos, setNeumaticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (marcaId) fetchNeumaticos();
    // eslint-disable-next-line
  }, [marcaId]);

  async function fetchNeumaticos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("neumaticos")
      .select("id, nombre, descripcion, precio, imagen")
      .eq("marca_id", marcaId)
      .order("nombre");
    setNeumaticos(data || []);
    setLoading(false);
  }

  const handleEditNeumatico = (neumaticoId) => {
    // Navegar directamente al formulario de edición del neumático específico
    router.push(`/admin/neumaticos?edit=${neumaticoId}`);
  };

  if (loading) return <div style={{ color: "#64748b" }}>Cargando neumáticos...</div>;
  if (neumaticos.length === 0) return <div style={{ color: "#64748b" }}>No hay neumáticos asociados a esta marca.</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
      {neumaticos.map(n => (
        <div key={n.id} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, border: "1px solid #e0f2fe", display: "flex", alignItems: "center", gap: 16 }}>
          {n.imagen && (
            <img src={n.imagen} alt={n.nombre} style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, background: "white" }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>{n.nombre}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{n.descripcion}</div>
            {/* PRECIO OCULTO - COMENTADO
            <div style={{ fontWeight: 700, color: "#0ea5e9", fontSize: 15 }}>${n.precio}</div>
            */}
          </div>
          <button
            onClick={() => handleEditNeumatico(n.id)}
            style={{ padding: "8px 16px", borderRadius: 8, background: "#0ea5e9", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
} 