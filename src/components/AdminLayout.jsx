"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/auth";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
      
      if (!authenticated) {
        router.push("/admin");
      }
    };

    checkAuth();

    // Verificar sesión cada 5 minutos
    const sessionCheck = setInterval(() => {
      if (typeof window !== 'undefined' && auth.isAuthenticated()) {
        const loginTime = localStorage.getItem('adminLoginTime');
        if (loginTime) {
          const now = Date.now();
          const sessionTime = 24 * 60 * 60 * 1000; // 24 horas
          const timeLeft = sessionTime - (now - parseInt(loginTime));
          
          // Mostrar advertencia cuando queden menos de 30 minutos
          if (timeLeft < 30 * 60 * 1000 && timeLeft > 0) {
            setSessionWarning(true);
          } else if (timeLeft <= 0) {
            auth.logout();
            router.push("/admin");
          }
        }
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(sessionCheck);
  }, [router]);

  const handleLogout = () => {
    auth.logout();
    router.push("/admin");
  };

  const handleSessionWarningClose = () => {
    setSessionWarning(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f3f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          fontSize: "18px",
          color: "#0ea5e9",
          fontWeight: "600"
        }}>
          Cargando panel de administración...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El router ya redirigió
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fa", display: "flex" }}>
      {/* Botón hamburguesa solo en mobile */}
      <style>{`
        @media (min-width: 901px) {
          .sidebar-admin-sticky {
            top: 0 !important;
            height: 100vh !important;
          }
        }
        @media (max-width: 900px) {
          .sidebar-admin-drawer {
            display: block !important;
          }
          .sidebar-admin-sticky {
            display: none !important;
          }
          .main-content-admin {
            margin-left: 0 !important;
            padding: 12px !important;
          }
          .hamburger-btn {
            display: flex !important;
            position: fixed !important;
            top: 16px !important;
            left: 16px !important;
            z-index: 300 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: #fff !important;
            box-shadow: 0 4px 16px rgba(30,41,59,0.12) !important;
            align-items: center !important;
            justify-content: center !important;
            border: none !important;
            padding: 0 !important;
          }
          .hamburger-btn span {
            width: 28px !important;
            height: 3px !important;
            background: #0ea5e9 !important;
            margin: 5px 0 !important;
            border-radius: 2px !important;
            display: block !important;
          }
        }
        .sidebar-admin-drawer > div {
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          transform: translateX(0);
        }
        .sidebar-admin-drawer[aria-hidden='true'] > div {
          transform: translateX(-100%);
        }
        .admin-btn {
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .admin-btn:active {
          filter: brightness(0.95);
        }
        .admin-card-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
      `}</style>
      {/* Header con botón hamburguesa solo en mobile */}
      <button
        className="hamburger-btn"
        aria-label="Abrir menú"
        onClick={() => setIsSidebarOpen(true)}
        style={{
          // El estilo principal ahora lo maneja la media query
          display: "none"
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {/* Sidebar sticky (desktop) */}
      <div
        className="sidebar-admin-sticky"
        style={{
          width: "280px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid #e0f2fe",
          padding: "18px 10px 10px 10px",
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          boxSizing: "border-box",
          minWidth: 0,
          zIndex: 20
        }}
      >
        {/* ...sidebar content... */}
        {/*** COPIAR AQUÍ EL CONTENIDO DEL SIDEBAR COMO ANTES ***/}
        <SidebarContent />
      </div>
      {/* Sidebar drawer (mobile) */}
      {isSidebarOpen && (
        <div
          className="sidebar-admin-drawer"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,41,59,0.25)",
            zIndex: 200,
            display: "flex"
          }}
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            style={{
              width: 260,
              maxWidth: "90vw",
              height: "100vh",
              background: "#fff",
              boxShadow: "2px 0 16px rgba(0,0,0,0.10)",
              padding: "18px 10px 10px 10px",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              aria-label="Cerrar menú"
              onClick={() => setIsSidebarOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "none",
                border: "none",
                fontSize: 28,
                color: "#64748b",
                cursor: "pointer"
              }}
            >
              ×
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
      {/* Main Content */}
      <div
        className="main-content-admin"
        style={{
          flex: 1,
          padding: "32px",
          minHeight: "100vh"
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Extraer el contenido del sidebar a un componente para reutilizarlo
function SidebarContent() {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoginTime');
      localStorage.removeItem('adminLoginAttempts');
      localStorage.removeItem('adminLockoutUntil');
      window.location.href = "/admin";
    }
  };
  return (
    <>
      <div
        className="sidebar-title"
        style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "#0ea5e9",
          marginBottom: "24px",
          textAlign: "center"
        }}
      >
        BOX<span style={{ color: "#1e293b" }}>ADMIN</span>
      </div>
      <nav>
        <div style={{ marginBottom: "18px" }}>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px"
            }}
          >
            Gestión de Contenido
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            <li style={{ marginBottom: "6px" }}>
              <a
                href="/admin/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: "#1e293b",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  background:
                    typeof window !== "undefined" && window.location.pathname === "/admin/dashboard"
                      ? "#e0f2fe"
                      : "transparent"
                }}
              >
                <span role="img" aria-label="dashboard" style={{ fontSize: 18 }}>📊</span> Dashboard
              </a>
            </li>
            <li style={{ marginBottom: "6px" }}>
              <a
                href="/admin/marcas"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: "#1e293b",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  background:
                    typeof window !== "undefined" && window.location.pathname === "/admin/marcas"
                      ? "#e0f2fe"
                      : "transparent"
                }}
              >
                <span role="img" aria-label="marcas" style={{ fontSize: 18 }}>🏷️</span> Marcas
              </a>
            </li>
            <li style={{ marginBottom: "6px" }}>
              <a
                href="/admin/neumaticos"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: "#1e293b",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  background:
                    typeof window !== "undefined" && window.location.pathname === "/admin/neumaticos"
                      ? "#e0f2fe"
                      : "transparent"
                }}
              >
                <span role="img" aria-label="neumaticos" style={{ fontSize: 18 }}>🚗</span> Neumáticos
              </a>
            </li>
            <li style={{ marginBottom: "6px" }}>
              <a
                href="/admin/tipos-vehiculo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: "#1e293b",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  background:
                    typeof window !== "undefined" && window.location.pathname === "/admin/tipos-vehiculo"
                      ? "#e0f2fe"
                      : "transparent"
                }}
              >
                <span role="img" aria-label="tipos" style={{ fontSize: 18 }}>🚙</span> Tipos de Vehículo
              </a>
            </li>
          </ul>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px"
            }}
          >
            Sistema
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            <li style={{ marginBottom: "6px" }}>
              <a
                href="/"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: "#1e293b",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "15px",
                  transition: "all 0.2s"
                }}
              >
                <span role="img" aria-label="web" style={{ fontSize: 18 }}>🌐</span> Ver Sitio Web
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div style={{ marginTop: "auto", paddingTop: "18px", borderTop: "1px solid #e0f2fe" }}>
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s"
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </>
  );
} 