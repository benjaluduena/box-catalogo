# 🛠️ Panel de Administración - BOX Neumáticos

## 📋 Descripción

Panel de administración completo para gestionar el catálogo de neumáticos de BOX Neumáticos. Este sistema permite administrar marcas, neumáticos, tipos de vehículo y medidas de forma segura y eficiente.

## 🔐 Acceso al Panel

### URL de Acceso
```
https://tu-dominio.com/admin
```

### Credenciales
- **Contraseña**: `box-admin-2024`
- **Método**: Autenticación basada en token (localStorage)

## 🏗️ Estructura del Panel

### 📊 Dashboard (`/admin/dashboard`)
- Resumen estadístico del sistema
- Contadores de neumáticos, marcas, tipos de vehículo y medidas
- Accesos rápidos a las principales funciones

### 🏷️ Gestión de Marcas (`/admin/marcas`)
- **Crear** nuevas marcas de neumáticos
- **Editar** información de marcas existentes
- **Eliminar** marcas (con confirmación)
- **Campos**: Nombre, URL del logo (opcional)

### 🚗 Gestión de Neumáticos (`/admin/neumaticos`)
- **Crear** nuevos neumáticos con información completa
- **Editar** neumáticos existentes
- **Eliminar** neumáticos (con confirmación)
- **Upload de imágenes** con drag & drop
- **Campos**:
  - Nombre
  - Descripción
  - Precio
  - Precio anterior (opcional)
  - Marca (relacionada)
  - Tipo de vehículo (relacionado)
  - Imagen
  - Marcadores: Más vendido, Destacado

### 🚙 Tipos de Vehículo (`/admin/tipos-vehiculo`)
- **Crear** nuevos tipos de vehículo
- **Editar** tipos existentes
- **Eliminar** tipos (con confirmación)
- **Campo**: Nombre del tipo

### 📏 Gestión de Medidas (`/admin/neumaticos/[id]/medidas`)
- **Crear** medidas para neumáticos específicos
- **Editar** medidas existentes
- **Eliminar** medidas (con confirmación)
- **Campos**: Medida, Stock

## 🎨 Características del Diseño

### 🎯 Consistencia Visual
- **Paleta de colores**: Azul (#0ea5e9) como color principal
- **Tipografía**: Poppins (Google Fonts)
- **Efectos**: Gradientes, sombras suaves, animaciones
- **Responsive**: Adaptado para móviles y tablets

### 🔧 Funcionalidades
- **Navegación lateral** fija con menú organizado
- **Formularios dinámicos** con validación
- **Mensajes de feedback** para todas las acciones
- **Confirmaciones** para acciones destructivas
- **Upload de imágenes** con preview
- **Filtros y búsquedas** en listas

## 🛡️ Seguridad

### 🔐 Autenticación
- **Token-based**: Almacenado en localStorage
- **Protección de rutas**: Middleware en cada página admin
- **Logout automático**: Al cerrar sesión

### 🚫 Acceso Restringido
- Solo administradores autorizados
- No visible en el sitio público
- Separado completamente del flujo de usuario

## 📱 Responsive Design

### 🖥️ Desktop
- Sidebar fijo de 280px
- Contenido principal con padding adecuado
- Grid layouts para listas

### 📱 Mobile
- Sidebar colapsable
- Formularios adaptados
- Botones táctiles optimizados

## 🔄 Funcionalidades CRUD

### ✅ Create (Crear)
- Formularios con validación
- Upload de imágenes integrado
- Relaciones automáticas entre tablas

### 📖 Read (Leer)
- Listas con información completa
- Relaciones mostradas correctamente
- Estados de carga y error

### ✏️ Update (Actualizar)
- Formularios pre-llenados
- Validación de datos
- Feedback inmediato

### 🗑️ Delete (Eliminar)
- Confirmaciones de seguridad
- Eliminación en cascada
- Mensajes de confirmación

## 🗄️ Base de Datos

### 📊 Tablas Principales
- **marcas**: id, nombre, logo
- **neumaticos**: id, nombre, descripción, precio, precio_anterior, imagen, marca_id, tipo_id, mas_vendido, destacado, created_at, updated_at
- **tipos_vehiculo**: id, nombre
- **medidas**: id, neumatico_id, medida, stock

### 🔗 Relaciones
- Neumáticos → Marcas (marca_id)
- Neumáticos → Tipos de Vehículo (tipo_id)
- Medidas → Neumáticos (neumatico_id)

## 🚀 Instalación y Configuración

### 1. Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 2. Supabase Storage
Crear bucket `neumaticos` para almacenar imágenes:
```sql
-- En Supabase Dashboard
-- Storage > Create bucket: "neumaticos"
-- Policies: Public read, authenticated write
```

### 3. Permisos de Base de Datos
```sql
-- RLS Policies para cada tabla
-- Permitir CRUD para usuarios autenticados
```

## 🔧 Personalización

### 🎨 Cambiar Contraseña
Editar en `src/lib/auth.js`:
```javascript
const ADMIN_TOKEN = 'tu-nuevo-token-seguro';
```

### 🌈 Cambiar Colores
Modificar variables CSS en `src/app/globals.css`:
```css
:root {
  --primary-color: #0ea5e9;
  --secondary-color: #38bdf8;
  /* ... más variables */
}
```

## 📞 Soporte

### 🐛 Reportar Problemas
- Revisar console del navegador
- Verificar conexión a Supabase
- Comprobar permisos de base de datos

### 🔧 Troubleshooting
1. **Error de autenticación**: Limpiar localStorage
2. **Error de upload**: Verificar bucket de Supabase
3. **Error de base de datos**: Verificar políticas RLS

---

**Desarrollado para BOX Neumáticos** 🚗💨
*Panel de administración seguro y eficiente* 