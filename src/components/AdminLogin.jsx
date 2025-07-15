"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import bcrypt from "bcryptjs";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const router = useRouter();

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos
  const ADMIN_TOKEN = "box-admin-2024-secure-token";

  useEffect(() => {
    // Verificar estado de bloqueo al cargar
    const attempts = parseInt(localStorage.getItem("adminLoginAttempts") || "0");
    const lockoutUntil = localStorage.getItem("adminLockoutUntil");
    setLoginAttempts(attempts);
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      setIsLockedOut(true);
      const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000 / 60);
      setLockoutTime(remaining);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verificar si está bloqueado
    const lockoutUntil = localStorage.getItem("adminLockoutUntil");
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      setIsLockedOut(true);
      const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000 / 60);
      setLockoutTime(remaining);
      setLoading(false);
      return;
    }

    try {
      // Obtener el hash de la tabla admin
      const { data, error: dbError } = await supabase
        .from("admin")
        .select("password_hash")
        .limit(1)
        .single();
      if (dbError || !data) {
        setError("Error de autenticación. Contacta al administrador.");
        setLoading(false);
        return;
      }
      const hash = data.password_hash;
      const match = await bcrypt.compare(password, hash);
      if (match) {
        // Resetear contador de intentos fallidos
        localStorage.removeItem("adminLoginAttempts");
        localStorage.removeItem("adminLockoutUntil");
        // Guardar token y tiempo de login
        localStorage.setItem("adminToken", ADMIN_TOKEN);
        localStorage.setItem("adminLoginTime", Date.now().toString());
        router.push("/admin/dashboard");
      } else {
        // Incrementar contador de intentos fallidos
        const attempts = parseInt(localStorage.getItem("adminLoginAttempts") || "0") + 1;
        localStorage.setItem("adminLoginAttempts", attempts.toString());
        setLoginAttempts(attempts);
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_TIME;
          localStorage.setItem("adminLockoutUntil", lockoutTime.toString());
          setIsLockedOut(true);
          setLockoutTime(Math.ceil(LOCKOUT_TIME / 1000 / 60));
          setError("Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.");
        } else {
          const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts;
          setError(`Contraseña incorrecta. Intentos restantes: ${remainingAttempts}`);
        }
      }
    } catch (err) {
      setError("Error de autenticación. Intenta de nuevo más tarde.");
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