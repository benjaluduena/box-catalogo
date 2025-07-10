import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MedidasInline({ neumaticoId }) {
  const [medidas, setMedidas] = useState([]);
  const [form, setForm] = useState({ medida: "", stock: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedidas();
  }, [neumaticoId]);

  async function fetchMedidas() {
    setLoading(true);
    const { data, error } = await supabase
      .from("medidas")
      .select("*")
      .eq("neumatico_id", neumaticoId)
      .order("medida");
    setMedidas(data || []);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const stockValue = parseInt(form.stock);
    if (isNaN(stockValue) || stockValue < 0) {
      setMessage("El stock debe ser 0 o mayor");
      return;
    }
    try {
      if (editingId) {
        const { error } = await supabase
          .from("medidas")
          .update({ ...form, stock: stockValue })
          .eq("id", editingId);
        if (error) throw error;
        setMessage("Medida actualizada");
      } else {
        const { error } = await supabase
          .from("medidas")
          .insert({ ...form, stock: stockValue, neumatico_id: neumaticoId });
        if (error) throw error;
        setMessage("Medida agregada");
      }
      setForm({ medida: "", stock: "" });
      setEditingId(null);
      fetchMedidas();
    } catch (err) {
      setMessage("Error al guardar la medida");
    }
  };

  const handleEdit = (m) => {
    setForm({ medida: m.medida, stock: m.stock.toString() });
    setEditingId(m.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta medida?")) return;
    await supabase.from("medidas").delete().eq("id", id);
    fetchMedidas();
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Medida (Ej: 205/55R16)"
          value={form.medida}
          onChange={e => setForm({ ...form, medida: e.target.value })}
          required
          style={{ flex: 2, padding: 8, borderRadius: 6, border: "1px solid #e0e0e0" }}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          required
          min={0}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #e0e0e0" }}
        />
        <button type="submit" style={{ padding: "8px 16px", borderRadius: 6, background: "#0ea5e9", color: "#fff", border: "none", fontWeight: 600 }}>
          {editingId ? "Actualizar" : "Agregar"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setForm({ medida: "", stock: "" }); setEditingId(null); }} style={{ padding: "8px 12px", borderRadius: 6, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", fontWeight: 600 }}>Cancelar</button>
        )}
      </form>
      {message && <div style={{ color: message.includes("Error") ? "#dc2626" : "#16a34a", marginBottom: 8 }}>{message}</div>}
      {loading ? (
        <div style={{ color: "#64748b" }}>Cargando medidas...</div>
      ) : medidas.length === 0 ? (
        <div style={{ color: "#64748b" }}>No hay medidas registradas</div>
      ) : (
        <table style={{ width: "100%", background: "#f8fafc", borderRadius: 8, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e0f2fe" }}>
              <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Medida</th>
              <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medidas.map(m => (
              <tr key={m.id}>
                <td style={{ padding: 8 }}>{m.medida}</td>
                <td style={{ padding: 8 }}>{m.stock}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleEdit(m)} style={{ marginRight: 8, color: "#64748b", background: "none", border: "none", cursor: "pointer" }} title="Editar">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button onClick={() => handleDelete(m.id)} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }} title="Eliminar">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 