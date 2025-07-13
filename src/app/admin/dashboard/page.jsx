"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout.jsx";
import { supabase } from "../../../lib/supabaseClient";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalNeumaticos: 0,
    totalMarcas: 0,
    totalTipos: 0,
    totalMedidas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [neumaticosRes, marcasRes, tiposRes, medidasRes] = await Promise.all([
        supabase.from("neumaticos").select("id", { count: "exact" }),
        supabase.from("marcas").select("id", { count: "exact" }),
        supabase.from("tipos_vehiculo").select("id", { count: "exact" }),
        supabase.from("medidas").select("id", { count: "exact" })
      ]);

      setStats({
        totalNeumaticos: neumaticosRes.count || 0,
        totalMarcas: marcasRes.count || 0,
        totalTipos: tiposRes.count || 0,
        totalMedidas: medidasRes.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px",
          marginTop: "20px"
        }}>
          <div style={{
            background: "#f0f9ff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #bae6fd"
          }}>
            <h3>Total Neumáticos</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0ea5e9" }}>
              {stats.totalNeumaticos}
            </p>
          </div>
          
          <div style={{
            background: "#f0fdf4",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            <h3>Total Marcas</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a" }}>
              {stats.totalMarcas}
            </p>
          </div>
          
          <div style={{
            background: "#fef3c7",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #fde68a"
          }}>
            <h3>Total Tipos de Vehículo</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#d97706" }}>
              {stats.totalTipos}
            </p>
          </div>
          
          <div style={{
            background: "#f3e8ff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #c4b5fd"
          }}>
            <h3>Total Medidas</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#7c3aed" }}>
              {stats.totalMedidas}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 