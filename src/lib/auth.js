// Sistema de autenticación mejorado para el panel admin
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export const auth = {
  // Verificar si el usuario está autenticado
  isAuthenticated: async () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      return data.authenticated;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  // Iniciar sesión con protección contra ataques de fuerza bruta
  login: async (password) => {
    if (typeof window === 'undefined') return false;
    
    // Verificar si está bloqueado
    const lockoutUntil = localStorage.getItem('adminLockoutUntil');
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      const remainingTime = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000 / 60);
      throw new Error(`Demasiados intentos fallidos. Intenta de nuevo en ${remainingTime} minutos.`);
    }
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Resetear contador de intentos fallidos
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminLockoutUntil');
        
        // Guardar tiempo de login
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
        
        throw new Error(data.error || 'Contraseña incorrecta');
      }
    } catch (error) {
      if (error.message.includes('intentos fallidos')) {
        throw error;
      }
      throw new Error('Error de conexión. Intenta de nuevo.');
    }
  },

  // Cerrar sesión
  logout: async () => {
    if (typeof window === 'undefined') return;
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminLoginAttempts');
    localStorage.removeItem('adminLockoutUntil');
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