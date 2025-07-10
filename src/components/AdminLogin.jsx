"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Verificar estado de bloqueo al cargar
    const attempts = auth.getLoginAttempts();
    const lockedOut = auth.isLockedOut();
    setLoginAttempts(attempts);
    setIsLockedOut(lockedOut);
    
    if (lockedOut) {
      const lockoutUntil = localStorage.getItem('adminLockoutUntil');
      if (lockoutUntil) {
        const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000 / 60);
        setLockoutTime(remaining);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (auth.login(password)) {
        router.push("/admin/dashboard");
      } else {
        const attempts = auth.getLoginAttempts();
        setLoginAttempts(attempts);
        const remainingAttempts = 5 - attempts;
        setError(`Contraseña incorrecta. Intentos restantes: ${remainingAttempts}`);
      }
    } catch (error) {
      setError(error.message);
      setIsLockedOut(true);
      const lockoutUntil = localStorage.getItem('adminLockoutUntil');
      if (lockoutUntil) {
        const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000 / 60);
        setLockoutTime(remaining);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #0284c7 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "48px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.2)",
        maxWidth: "400px",
        width: "100%"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#0ea5e9",
            marginBottom: "8px"
          }}>
            BOX<span style={{ color: "#1e293b" }}>ADMIN</span>
          </div>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Panel de Administración
          </p>
        </div>

        {isLockedOut ? (
          <div style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #fecaca"
          }}>
            <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              🔒 Acceso Bloqueado
            </div>
            <div style={{ fontSize: "14px" }}>
              Demasiados intentos fallidos. Intenta de nuevo en {lockoutTime} minutos.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#1e293b"
              }}>
                Contraseña de Administrador
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "2px solid #e0f2fe",
                    fontSize: "16px",
                    background: "#f8fafc",
                    transition: "all 0.2s"
                  }}
                  placeholder="Ingresa la contraseña"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    fontSize: 20,
                    cursor: "pointer",
                    padding: 0
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {loginAttempts > 0 && (
              <div style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
                border: "1px solid #fde68a"
              }}>
                ⚠️ Intentos fallidos: {loginAttempts}/5
              </div>
            )}

            {error && (
              <div style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
                border: "1px solid #fecaca"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
            >
              {loading ? "Verificando..." : "Acceder al Panel"}
            </button>
          </form>
        )}

        <div style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#94a3b8"
        }}>
          Acceso restringido solo para administradores
        </div>
      </div>
    </div>
  );
} 