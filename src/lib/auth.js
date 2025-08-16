// Sistema de autenticación mejorado para el panel admin
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

if (!ADMIN_TOKEN || !ADMIN_PASSWORD) {
  console.error('Missing admin environment variables');
}

export const auth = {
  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!token || token !== ADMIN_TOKEN) return false;
    
    // Verificar si la sesión no ha expirado (24 horas)
    if (loginTime) {
      const now = Date.now();
      const sessionTime = 24 * 60 * 60 * 1000; // 24 horas
      if (now - parseInt(loginTime) > sessionTime) {
        auth.logout();
        return false;
      }
    }
    
    return true;
  },

  // Iniciar sesión con protección contra ataques de fuerza bruta
  login: (password) => {
    if (typeof window === 'undefined') return false;
    
    // Verificar si está bloqueado
    const lockoutUntil = localStorage.getItem('adminLockoutUntil');
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      const remainingTime = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000 / 60);
      throw new Error(`Demasiados intentos fallidos. Intenta de nuevo en ${remainingTime} minutos.`);
    }
    
    if (password === ADMIN_PASSWORD) {
      // Resetear contador de intentos fallidos
      localStorage.removeItem('adminLoginAttempts');
      localStorage.removeItem('adminLockoutUntil');
      
      // Guardar token y tiempo de login
      localStorage.setItem('adminToken', ADMIN_TOKEN);
      localStorage.setItem('adminLoginTime', Date.now().toString());
      return true;
    } else {
      // Incrementar contador de intentos fallidos
      const attempts = parseInt(localStorage.getItem('adminLoginAttempts') || '0') + 1;
      localStorage.setItem('adminLoginAttempts', attempts.toString());
      
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_TIME;
        localStorage.setItem('adminLockoutUntil', lockoutTime.toString());
        throw new Error('Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.');
      }
      
      return false;
    }
  },

  // Cerrar sesión
  logout: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminLoginAttempts');
    localStorage.removeItem('adminLockoutUntil');
  },

  // Obtener token
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken');
  },

  // Verificar si hay intentos fallidos
  getLoginAttempts: () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('adminLoginAttempts') || '0');
  },

  // Verificar si está bloqueado
  isLockedOut: () => {
    if (typeof window === 'undefined') return false;
    const lockoutUntil = localStorage.getItem('adminLockoutUntil');
    return lockoutUntil && Date.now() < parseInt(lockoutUntil);
  }
}; 