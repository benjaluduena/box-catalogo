// instrumentation.js - Se ejecuta al iniciar el servidor de Next.js
// Soluciona el problema de Node.js 25+ donde globalThis.localStorage existe
// como objeto pero sin los métodos estándar (getItem, setItem, removeItem).
// Esto causa errores en librerías como @supabase/supabase-js que detectan
// localStorage como disponible pero fallan al llamar sus métodos.

export async function register() {
  if (typeof window === 'undefined') {
    // Estamos en el servidor (Node.js)
    // Verificar si localStorage existe pero no tiene los métodos esperados
    if (
      typeof globalThis.localStorage !== 'undefined' &&
      typeof globalThis.localStorage.getItem !== 'function'
    ) {
      // Reemplazar con un mock funcional que no haga nada
      globalThis.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        get length() { return 0; },
      };
    }
  }
}
