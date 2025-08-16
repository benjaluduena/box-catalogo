# 🎨 Corrección de Error CSS Module

## ❌ Error Encontrado

```
Syntax error: Selector "*" is not pure (pure selectors must contain at least one local class or id)
```

## 🔍 Causa del Problema

Los **CSS Modules** en Next.js no permiten selectores universales (`*`) porque requieren que todos los selectores contengan al menos una clase o ID local para mantener el scope del módulo.

## ✅ Solución Aplicada

### 1. **Movimos estilos globales a `globals.css`**

Los estilos de `prefers-reduced-motion` que usaban el selector `*` se movieron de:
- `src/styles/CatalogoNeumaticos.module.css` ❌
- A `src/app/globals.css` ✅

### 2. **Estilos globales correctos**

```css
/* En globals.css - CORRECTO */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto !important;
  }
}
```

### 3. **CSS Module limpio**

El archivo `CatalogoNeumaticos.module.css` ahora solo contiene selectores válidos con clases locales.

## 🚀 Resultado

✅ **Error de sintaxis corregido**  
✅ **CSS Module válido**  
✅ **Servidor funcionando sin errores**  
✅ **Accesibilidad mantenida** (reduced motion sigue funcionando)

## 📝 Buenas Prácticas

### **CSS Modules - Solo para componentes específicos:**
- `.className` ✅
- `.component:hover` ✅
- `.element.modifier` ✅

### **Globals.css - Para estilos universales:**
- `*` ✅
- `html, body` ✅
- `@media` queries globales ✅

---

**✅ Error solucionado - CSS Module funcionando correctamente**