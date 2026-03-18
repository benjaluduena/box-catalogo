# 📦 Box Neumáticos — Catálogo Web

## Descripción General

**Box Neumáticos** es una aplicación web construida con **Next.js 15** para una tienda de neumáticos ubicada en **Villa del Rosario, Córdoba, Argentina**. Funciona como un catálogo digital con panel de administración, permitiendo a los clientes explorar productos y contactar vía WhatsApp para cotizar.

> **No hay precios ni stock visibles** — el modelo de negocio dirige al cliente a consultar por WhatsApp.

---

## 🛠️ Stack Tecnológico

| Tecnología        | Versión / Detalle                      |
| ----------------- | -------------------------------------- |
| **Framework**     | Next.js 15.3.5 (App Router)            |
| **Frontend**      | React 19                               |
| **Base de datos** | Supabase (PostgreSQL)                  |
| **Estilos**       | CSS Modules + CSS global + Tailwind v4 |
| **Íconos**        | FontAwesome Free 6.7.2                 |
| **Auth**          | Cookies HTTP-only + bcryptjs           |
| **Deploy**        | Vercel                                 |

---

## 📁 Estructura del Proyecto

```
box-catalogo/
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── layout.js                 # Layout raíz (SEO, schema.org, fuentes)
│   │   ├── page.js                   # Página principal (landing)
│   │   ├── globals.css               # Estilos globales
│   │   ├── error.js                  # Página de error
│   │   ├── loading.js                # Indicador de carga
│   │   ├── robots.js                 # Configuración robots.txt
│   │   ├── sitemap.js                # Generador de sitemap
│   │   ├── catalogo/
│   │   │   ├── page.jsx              # Página del catálogo completo
│   │   │   └── [id]/                 # Detalle de neumático (ruta dinámica)
│   │   ├── admin/
│   │   │   ├── page.jsx              # Login del admin
│   │   │   ├── layout.js             # Layout del admin
│   │   │   ├── dashboard/            # Dashboard principal
│   │   │   ├── marcas/               # CRUD de marcas
│   │   │   ├── neumaticos/           # CRUD de neumáticos
│   │   │   └── tipos-vehiculo/       # CRUD de tipos de vehículo
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.js    # Endpoint de login
│   │           ├── logout/route.js   # Endpoint de logout
│   │           └── verify/route.js   # Verificar sesión
│   ├── components/
│   │   ├── Header.jsx                # Barra de navegación
│   │   ├── Footer.jsx                # Pie de página
│   │   ├── Hero.jsx                  # Sección hero de la landing
│   │   ├── Services.jsx              # Sección de servicios
│   │   ├── Brands.jsx                # Sección de marcas
│   │   ├── About.jsx                 # Sección "Nosotros"
│   │   ├── Location.jsx              # Mapa y ubicación
│   │   ├── WhatsappFloat.jsx         # Botón flotante de WhatsApp
│   │   ├── RootLayoutClient.jsx      # Layout client-side (header/footer condicional)
│   │   ├── CatalogoNeumaticosEnhanced.jsx  # Catálogo principal con filtros
│   │   ├── CatalogoNeumaticos.jsx    # Versión base del catálogo
│   │   ├── OptimizedNeumaticoCard.jsx # Tarjeta de producto optimizada
│   │   ├── SimplifiedFilters.jsx     # Filtros del catálogo
│   │   ├── AdvancedFilters.jsx       # Filtros avanzados
│   │   ├── SearchWithSuggestions.jsx  # Búsqueda con autocompletado
│   │   ├── MedidasInline.jsx         # Medidas del neumático
│   │   ├── AdminLogin.jsx            # Formulario de login admin
│   │   ├── AdminLayout.jsx           # Layout del panel admin (sidebar)
│   │   ├── AdminPanel.jsx            # Acceso rápido al admin
│   │   ├── ErrorBoundary.jsx         # Manejo de errores React
│   │   ├── SkeletonLoader.jsx        # Loaders skeleton
│   │   ├── PullToRefresh.jsx         # Pull-to-refresh para mobile
│   │   ├── AccessibilityAnnouncer.jsx # Anuncios de accesibilidad
│   │   ├── MobileTabNavigation.jsx   # Navegación tab en mobile
│   │   ├── BraveCompatibilityNotice.jsx # Aviso para Brave/Edge
│   │   └── NeumaticosPorMarca.jsx    # Neumáticos agrupados por marca
│   ├── hooks/
│   │   ├── useInfiniteScroll.js      # Scroll infinito
│   │   ├── useKeyboardNavigation.js  # Navegación por teclado
│   │   ├── useTouchGestures.js       # Gestos táctiles
│   │   └── useEnhancedSwipe.js       # Swipe mejorado
│   ├── lib/
│   │   ├── supabaseClient.js         # Cliente de Supabase
│   │   ├── auth.js                   # Lógica de autenticación client-side
│   │   ├── rateLimit.js              # Rate limiting para APIs
│   │   └── validation.js             # Validación de inputs
│   ├── middleware.js                  # Middleware (rate limit + protección admin)
│   └── styles/
│       └── CatalogoNeumaticos.module.css # Estilos CSS Modules del catálogo
├── public/                            # Archivos estáticos (imágenes, etc.)
├── next.config.mjs                    # Configuración de Next.js
├── package.json                       # Dependencias del proyecto
├── .env.local                         # Variables de entorno (NO subir a git)
└── esquema_supabase.txt               # Script SQL para recrear la BD
```

---

## 🗄️ Base de Datos (Supabase)

### Tablas principales:

| Tabla             | Descripción                                             |
| ----------------- | ------------------------------------------------------- |
| `admin`           | Credenciales del administrador (hash bcrypt)             |
| `marcas`          | Marcas de neumáticos (nombre, logo, activo)              |
| `tipos_vehiculo`  | Categorías: Auto, Camioneta, Camión, Moto, Agro          |
| `neumaticos`      | Productos con nombre, descripción, imagen, marca, tipo   |
| `medidas`         | Medidas disponibles por neumático                        |

### Relaciones:
- `neumaticos.marca_id` → `marcas.id`
- `neumaticos.tipo_id` → `tipos_vehiculo.id`
- `medidas.neumatico_id` → `neumaticos.id`

El archivo `esquema_supabase.txt` en la raíz contiene el SQL completo para recrear las tablas.

---

## 🔐 Variables de Entorno

Archivo `.env.local` (requerido):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
ADMIN_PASSWORD=tu-contraseña-admin
ADMIN_SECRET_KEY=clave-secreta-para-cookie
```

---

## 🌐 Páginas del Sitio

### Público:
- **`/`** — Landing page con Hero, Servicios, Marcas, Nosotros y Ubicación
- **`/catalogo`** — Catálogo completo con filtros por marca, búsqueda y categorías
- **`/catalogo/[id]`** — Detalle de un neumático específico con botón "Cotizar por WhatsApp"

### Admin (`/admin`):
- **`/admin`** — Login con protección contra fuerza bruta (5 intentos, lockout 15 min)
- **`/admin/dashboard`** — Dashboard con estadísticas
- **`/admin/marcas`** — CRUD de marcas
- **`/admin/neumaticos`** — CRUD de neumáticos
- **`/admin/tipos-vehiculo`** — CRUD de tipos de vehículo

---

## 🔒 Seguridad

- **Autenticación por cookie HTTP-only** — El login genera un token seguro en cookie
- **Rate limiting** — Middleware que limita requests a la API (100 req/15 min por IP)
- **Lockout por fuerza bruta** — 5 intentos fallidos bloquean el login por 15 minutos
- **Headers de seguridad** — X-Content-Type-Options, X-Frame-Options, CSP, etc.
- **Validación de inputs** — Sanitización y validación server-side

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Lint
npm run lint
```

---

## 📱 Funcionalidades Destacadas

- **Diseño responsive** — Optimizado para mobile con gestos táctiles
- **Pull to refresh** — Recargar datos deslizando hacia abajo
- **Búsqueda con sugerencias** — Autocompletado al buscar
- **Filtros por marca** — Selección múltiple de marcas
- **Skeleton loaders** — UI fluida durante la carga
- **Accesibilidad** — Navegación por teclado, ARIA labels, anuncios
- **SEO** — Metadata, OpenGraph, Schema.org, sitemap, robots.txt
- **Compatibilidad** — Detección y avisos para Brave/Edge
- **Botón WhatsApp** — Flotante para contacto rápido
