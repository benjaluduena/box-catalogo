"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { supabase } from "../../../lib/supabaseClient";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    neumaticos: 0,
    marcas: 0,
    tiposVehiculo: 0,
    medidas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [neumaticosRes, marcasRes, tiposRes, medidasRes] = await Promise.all([
          supabase.from("neumaticos").select("id", { count: "exact" }),
          supabase.from("marcas").select("id", { count: "exact" }),
          supabase.from("tipos_vehiculo").select("id", { count: "exact" }),
          supabase.from("medidas").select("id", { count: "exact" })
        ]);

        // Verificar errores en cada consulta
        if (neumaticosRes.error) throw new Error("Error al cargar neumáticos");
        if (marcasRes.error) throw new Error("Error al cargar marcas");
        if (tiposRes.error) throw new Error("Error al cargar tipos de vehículo");
        if (medidasRes.error) throw new Error("Error al cargar medidas");

        setStats({
          neumaticos: neumaticosRes.count || 0,
          marcas: marcasRes.count || 0,
          tiposVehiculo: tiposRes.count || 0,
          medidas: medidasRes.count || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Mostrar mensaje de error más amigable
        setStats({
          neumaticos: 0,
          marcas: 0,
          tiposVehiculo: 0,
          medidas: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0f2fe",
      flex: 1,
      minWidth: "200px"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ fontSize: "32px" }}>{icon}</div>
        <div style={{
          fontSize: "32px",
          fontWeight: "800",
          color: color
        }}>
          {loading ? "..." : value}
        </div>
      </div>
      <div style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#1e293b"
      }}>
        {title}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#0ea5e9",
            marginBottom: "8px"
          }}>
            Dashboard
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Resumen general del sistema
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          marginBottom: "32px"
        }}>
          <StatCard
            title="Neumáticos"
            value={stats.neumaticos}
            icon="🚗"
            color="#0ea5e9"
          />
          <StatCard
            title="Marcas"
            value={stats.marcas}
            icon="🏷️"
            color="#10b981"
          />
          <StatCard
            title="Tipos de Vehículo"
            value={stats.tiposVehiculo}
            icon="🚙"
            color="#f59e0b"
          />
        </div>

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
            Acciones Rápidas
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <a
              href="/admin/neumaticos"
              style={{
                display: "block",
                padding: "16px",
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "600",
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              ➕ Agregar Neumático
            </a>
            <a
              href="/admin/marcas"
              style={{
                display: "block",
                padding: "16px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "600",
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              🏷️ Nueva Marca
            </a>
            <a
              href="/admin/tipos-vehiculo"
              style={{
                display: "block",
                padding: "16px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "600",
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              🚙 Nuevo Tipo
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 