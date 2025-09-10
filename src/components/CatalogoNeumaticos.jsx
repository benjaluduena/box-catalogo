"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import MobileTabNavigation from './MobileTabNavigation';
import { useEnhancedSwipe } from '../hooks/useEnhancedSwipe';

// Subcomponente para la tarjeta de neumático con animaciones de entrada
function NeumaticoCard({ neumatico, onClick, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const { nombre, descripcion, precio, precio_anterior, imagen, marcas } = neumatico;

  // Intersection Observer para animaciones de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100); // Delay escalonado
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  // Formateo de precios con puntos - COMENTADO PARA OCULTAR PRECIOS
  // const precioFormateado = typeof precio === 'number' ? precio.toLocaleString('es-AR') : precio;
  // const precioAnteriorFormateado = typeof precio_anterior === 'number' ? precio_anterior.toLocaleString('es-AR') : precio_anterior;
  return (
    <div 
      ref={cardRef}
      className={`neumatico-card ${isVisible ? 'card-visible' : 'card-hidden'}`} 
      onClick={onClick} 
      style={{ cursor: "pointer", position: "relative" }}
    >
      {/* Banda de marca reubicada a la izquierda */}
      {marcas?.nombre && (
        <div style={{
          position: "absolute",
          top: 14,
          left: 18,
          background: "#e0f2fe",
          color: "#0ea5e9",
          fontWeight: 700,
          fontSize: 13,
          borderRadius: 12,
          padding: "2px 16px",
          zIndex: 2,
          letterSpacing: 0.5,
          textTransform: "uppercase"
        }}>{marcas.nombre}</div>
      )}
      {/* Imagen mejorada - más grande */}
      <div style={{ flex: "0 0 140px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 24, marginBottom: 16 }}>
        <img
          src={imagen || "/images/placeholder-tire.png"}
          alt={nombre}
          style={{ 
            width: 120, 
            height: 120, 
            objectFit: "contain", 
            background: "transparent", 
            borderRadius: 16, 
            boxShadow: "0 4px 16px rgba(14,165,233,0.12)",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        />
      </div>
      {/* Info mejorada */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ 
          fontWeight: 800, 
          fontSize: 22, 
          color: "#0f172a", 
          marginBottom: 4, 
          lineHeight: 1.2,
          overflow: "hidden", 
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}>{nombre}</div>
        <div style={{ 
          color: "#64748b", 
          fontSize: 16, 
          marginBottom: 6, 
          fontWeight: 600, 
          lineHeight: 1.4,
          overflow: "hidden", 
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}>{descripcion}</div>
        
        {/* Indicador visual adicional con micro-animación */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12, 
          marginBottom: 8,
          color: "#0ea5e9",
          fontSize: 14,
          fontWeight: 600
        }}>
          <i className="fas fa-shipping-fast icon-pulse" style={{ fontSize: 14 }}></i>
          <span>Disponible para cotizar</span>
        </div>
        {/* PRECIOS OCULTOS - COMENTADO
        <div style={{ fontWeight: 800, fontSize: 22, color: "#171717", marginBottom: 2, display: "flex", alignItems: "center", gap: 10 }}>
          ${precioFormateado}
          {precio_anterior && (
            <span style={{ textDecoration: "line-through", color: "#94a3b8", marginLeft: 6, fontWeight: 500, fontSize: 15 }}>${precioAnteriorFormateado}</span>
          )}
        </div>
        */}
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button
            className="btn btn-success btn-cotizar"
            style={{ 
              borderRadius: 12, 
              padding: "12px 24px", 
              fontWeight: 700, 
              fontSize: 16, 
              border: "none", 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              cursor: "pointer",
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.3)";
            }}
            onClick={e => { e.stopPropagation(); onClick(); }}
            aria-label="Cotizar neumático"
          >
            <i className="fas fa-whatsapp icon-bounce" style={{ fontSize: 18 }}></i>
            <span className="cotizar-text" style={{ display: "inline" }}> <span style={{ fontSize: 16 }}>Cotizar</span></span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para indicadores de deslizamiento mejorado
function SwipeIndicator({ totalItems, currentIndex, onDotClick }) {
  if (totalItems <= 1) return null;
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginTop: 20,
      padding: '12px 0',
      background: 'rgba(255,255,255,0.8)',
      borderRadius: 20,
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(14,165,233,0.1)',
      boxShadow: '0 2px 12px rgba(14,165,233,0.06)'
    }}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          style={{
            width: currentIndex === index ? 28 : 10,
            height: 10,
            borderRadius: 5,
            border: 'none',
            background: currentIndex === index 
              ? 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)' 
              : '#cbd5e1',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: 0,
            position: 'relative',
            boxShadow: currentIndex === index 
              ? '0 2px 8px rgba(14,165,233,0.3)' 
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (currentIndex !== index) {
              e.target.style.background = '#94a3b8';
              e.target.style.transform = 'scale(1.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentIndex !== index) {
              e.target.style.background = '#cbd5e1';
              e.target.style.transform = 'scale(1)';
            }
          }}
          aria-label={`Ir al producto ${index + 1}`}
        />
      ))}
    </div>
  );
}

// Componente para mostrar texto de ayuda de deslizamiento
function SwipeHint({ show }) {
  if (!show) return null;
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: '#64748b',
      fontSize: 14,
      fontWeight: 500,
      marginBottom: 12,
      padding: '8px 16px',
      background: '#f1f5f9',
      borderRadius: 20,
      margin: '0 auto 16px auto',
      width: 'fit-content',
      animation: 'fadeInSlide 0.5s ease-out'
    }}>
      <i className="fas fa-hand-pointer" style={{ fontSize: 16, color: '#0ea5e9' }}></i>
      Desliza para ver más productos
      <i className="fas fa-arrow-right" style={{ fontSize: 14, marginLeft: 4, animation: 'slideRight 2s infinite' }}></i>
    </div>
  );
}

// Componente para el modal Quick View
function QuickViewModal({ neumatico, onClose, onViewFull }) {
  if (!neumatico) return null;
  
  // PRECIOS OCULTOS - COMENTADO
  // const precioFormateado = typeof neumatico.precio === 'number' ? neumatico.precio.toLocaleString('es-AR') : neumatico.precio;
  // const precioAnteriorFormateado = typeof neumatico.precio_anterior === 'number' ? neumatico.precio_anterior.toLocaleString('es-AR') : neumatico.precio_anterior;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 24,
        maxWidth: 500,
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
            color: '#64748b'
          }}
        >
          ×
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img
            src={neumatico.imagen || "/images/placeholder-tire.png"}
            alt={neumatico.nombre}
            style={{
              width: 150,
              height: 150,
              objectFit: 'contain',
              borderRadius: 12,
              marginBottom: 16
            }}
          />
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9', margin: '0 0 8px 0' }}>
            {neumatico.nombre}
          </h3>
          <p style={{ color: '#64748b', fontSize: 16, fontWeight: 600, margin: '0 0 16px 0' }}>
            {neumatico.marcas?.nombre}
          </p>
          {/* PRECIOS OCULTOS - COMENTADO
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 24, color: '#171717' }}>${precioFormateado}</span>
            {neumatico.precio_anterior && (
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: 18 }}>${precioAnteriorFormateado}</span>
            )}
          </div>
          */}
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
            {neumatico.descripcion}
          </p>
          <button
            onClick={() => {
              // Generar mensaje pre-escrito para WhatsApp
              const mensaje = `Hola! Me interesa cotizar el neumático *${neumatico.nombre}* de la marca ${neumatico.marcas?.nombre || 'sin marca'}. ${neumatico.descripcion ? `\n\nDescripción: ${neumatico.descripcion}` : ''}\n\n¿Podrían enviarme información sobre disponibilidad y precio?\n\nGracias!`;
              const numeroWhatsApp = "+5493515123456"; // Reemplazar con tu número real
              const urlWhatsApp = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
              window.open(urlWhatsApp, '_blank');
              onClose(); // Cerrar modal
            }}
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}
          >
            <i className="fas fa-whatsapp"></i>
            Cotizar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para los filtros
function FiltrosPanel({ filtros, setFiltros, ordenamiento, setOrdenamiento, marcasDisponibles, mostrarFiltros, setMostrarFiltros }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 24,
      boxShadow: '0 4px 16px rgba(14,165,233,0.08)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mostrarFiltros ? 20 : 0 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0ea5e9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-filter"></i>
          Filtros y Ordenamiento
        </h3>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0ea5e9',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
          <i className={`fas fa-chevron-${mostrarFiltros ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      {mostrarFiltros && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          alignItems: 'end'
        }}>
          {/* Búsqueda mejorada */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#0f172a', fontSize: 16 }}>
              <i className="fas fa-search" style={{ marginRight: 8, color: '#0ea5e9' }}></i>
              Buscar neumático:
            </label>
            <input
              type="text"
              placeholder="Busca por marca, nombre o medida..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                transition: 'all 0.3s ease',
                background: '#fff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          {/* FILTROS DE PRECIO OCULTOS - COMENTADO
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
              Precio mín:
            </label>
            <input
              type="number"
              placeholder="0"
              value={filtros.precioMin}
              onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
              Precio máx:
            </label>
            <input
              type="number"
              placeholder="999999"
              value={filtros.precioMax}
              onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>
          */}
          
          {/* Filtro por marca mejorado */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#0f172a', fontSize: 16 }}>
              <i className="fas fa-tags" style={{ marginRight: 8, color: '#0ea5e9' }}></i>
              Marca:
            </label>
            <select
              value={filtros.marcaSeleccionada}
              onChange={(e) => setFiltros({ ...filtros, marcaSeleccionada: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                background: '#fff',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">🏷️ Todas las marcas</option>
              {marcasDisponibles.map(marca => (
                <option key={marca.id} value={marca.id}>🔹 {marca.nombre}</option>
              ))}
            </select>
          </div>
          
          {/* Ordenamiento mejorado */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#0f172a', fontSize: 16 }}>
              <i className="fas fa-sort" style={{ marginRight: 8, color: '#0ea5e9' }}></i>
              Ordenar por:
            </label>
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                background: '#fff',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="nombre-asc">📝 Nombre A-Z</option>
              <option value="nombre-desc">📝 Nombre Z-A</option>
              <option value="marca-asc">🏷️ Marca A-Z</option>
              <option value="destacado">⭐ Destacados primero</option>
            </select>
          </div>
          
          {/* Botón limpiar filtros mejorado */}
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button
              onClick={() => {
                setFiltros({ marcaSeleccionada: '', busqueda: '' });
                setOrdenamiento('nombre-asc');
              }}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '12px 20px',
                fontSize: 15,
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              <i className="fas fa-eraser"></i>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CatalogoNeumaticos() {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [neumaticosPorTipo, setNeumaticosPorTipo] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Estados para filtros y ordenamiento
  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    marcaSeleccionada: '',
    busqueda: ''
  });
  const [ordenamiento, setOrdenamiento] = useState('nombre-asc');
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [quickViewNeumatico, setQuickViewNeumatico] = useState(null);
  const [activeTab, setActiveTab] = useState('destacados');

  useEffect(() => {
    async function fetchTiposYNeumaticos() {
      setLoading(true);
      // Obtener tipos de vehículo
      const { data: tipos, error: errorTipos } = await supabase
        .from("tipos_vehiculo")
        .select("id, nombre")
        .order("nombre");
      if (errorTipos) {
        setTiposVehiculo([]);
        setLoading(false);
        return;
      }
      setTiposVehiculo(tipos);
      // Obtener neumáticos agrupados por tipo
      const { data: neumaticos, error: errorNeumaticos } = await supabase
        .from("neumaticos")
        .select("*, marcas(nombre, logo), tipos_vehiculo(nombre)")
        .order("id", { ascending: true });
      if (errorNeumaticos) {
        setNeumaticosPorTipo({});
        setLoading(false);
        return;
      }
      // Agrupar neumáticos por tipo_id
      const agrupados = {};
      tipos.forEach(tipo => {
        agrupados[tipo.id] = [];
      });
      neumaticos.forEach(n => {
        if (n.tipo_id && agrupados[n.tipo_id]) {
          agrupados[n.tipo_id].push(n);
        }
      });
      setNeumaticosPorTipo(agrupados);
      // Filtrar destacados
      setDestacados(neumaticos.filter(n => n.destacado));
      
      // Obtener marcas únicas para el filtro
      const marcasUnicas = [...new Map(neumaticos.map(n => [n.marcas?.id, n.marcas]).filter(([id, marca]) => marca)).values()];
      setMarcasDisponibles(marcasUnicas);
      
      setLoading(false);
    }
    fetchTiposYNeumaticos();

    // Ocultar hint después de 5 segundos
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Manejar expansión de categorías
  const handleExpandirCategoria = (tipoId) => {
    setCategoriasExpandidas((prev) =>
      prev.includes(tipoId)
        ? prev.filter((id) => id !== tipoId)
        : [...prev, tipoId]
    );
  };

  // Función para manejar el scroll y actualizar el índice actual
  const handleScroll = (e, categoryId) => {
    const container = e.target;
    const cardWidth = container.children[0]?.offsetWidth || 0;
    const scrollLeft = container.scrollLeft;
    const currentIndex = Math.round(scrollLeft / cardWidth);
    
    setCurrentIndexes(prev => ({
      ...prev,
      [categoryId]: currentIndex
    }));
  };

  // Función para navegar a un producto específico
  const scrollToIndex = (categoryId, index) => {
    const container = document.querySelector(`[data-category="${categoryId}"] .catalogo-grid`);
    if (container) {
      const cardWidth = container.children[0]?.offsetWidth || 0;
      container.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  };

  // Función para filtrar y ordenar neumáticos
  const filtrarYOrdenarNeumaticos = (neumaticos) => {
    let resultado = [...neumaticos];
    
    // Aplicar filtros
    // FILTROS DE PRECIO COMENTADOS
    /*
    if (filtros.precioMin !== '') {
      resultado = resultado.filter(n => n.precio >= parseFloat(filtros.precioMin));
    }
    if (filtros.precioMax !== '') {
      resultado = resultado.filter(n => n.precio <= parseFloat(filtros.precioMax));
    }
    */
    if (filtros.marcaSeleccionada !== '') {
      resultado = resultado.filter(n => n.marcas?.id?.toString() === filtros.marcaSeleccionada.toString());
    }
    if (filtros.busqueda !== '') {
      const busquedaLower = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(n => 
        n.nombre?.toLowerCase().includes(busquedaLower) ||
        n.descripcion?.toLowerCase().includes(busquedaLower) ||
        n.marcas?.nombre?.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Aplicar ordenamiento
    switch (ordenamiento) {
      // ORDENAMIENTO POR PRECIO COMENTADO
      /*
      case 'precio-asc':
        resultado.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        resultado.sort((a, b) => b.precio - a.precio);
        break;
      */
      case 'nombre-asc':
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'marca-asc':
        resultado.sort((a, b) => (a.marcas?.nombre || '').localeCompare(b.marcas?.nombre || ''));
        break;
      case 'destacado':
        resultado.sort((a, b) => {
          // Destacados primero, luego por nombre
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return a.nombre.localeCompare(b.nombre);
        });
        break;
      default:
        break;
    }
    
    return resultado;
  };

  // Función para manejar cambio de tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Scroll suave a la sección correspondiente
    setTimeout(() => {
      const section = document.querySelector(`[data-category="${tabId}"]`);
      if (section) {
        section.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Calcular contadores para las tabs
  const calcularContadores = () => {
    const contadores = {};
    
    // Destacados
    if (destacados.length > 0) {
      contadores['destacados'] = destacados.length;
    }
    
    // Por tipo
    tiposVehiculo.forEach(tipo => {
      const neumaticos = neumaticosPorTipo[tipo.id] || [];
      if (neumaticos.length > 0) {
        contadores[tipo.id] = neumaticos.length;
      }
    });
    
    return contadores;
  };

  // Función para obtener el icono según el nombre de la categoría
  function getCategoriaIcon(nombre) {
    if (!nombre) return "fa-box";
    const n = nombre.toLowerCase();
    if (n.includes("auto")) return "fa-car";
    if (n.includes("camioneta")) return "fa-truck-pickup";
    if (n.includes("camion")) return "fa-truck";
    if (n.includes("moto")) return "fa-motorcycle";
    if (n.includes("agro")) return "fa-tractor";
    if (n.includes("destacad")) return "fa-star";
    return "fa-box";
  }

  // Estilo de fondo para las categorías con mejoras responsive
  const categoriaStyle = {
    background: '#fff',
    borderRadius: 32,
    boxShadow: '0 12px 48px rgba(14,165,233,0.12)',
    border: '2px solid #e0f2fe',
    padding: window.innerWidth > 768 ? '48px 40px 52px 40px' : '36px 32px 40px 32px',
    margin: '0 auto 24px auto',
    maxWidth: window.innerWidth > 1200 ? 1400 : 1300,
    width: '100%',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: window.innerWidth > 768 ? 24 : 18,
    position: 'relative',
    overflow: 'hidden'
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando catálogo...</p>;
  if (!tiposVehiculo.length) return <p style={{ textAlign: "center" }}>No hay tipos de vehículo disponibles.</p>;

  // Mover el tipo 'Agro' al final si existe
  const tiposOrdenados = [...tiposVehiculo];
  const idxAgro = tiposOrdenados.findIndex(t => t.nombre && t.nombre.toLowerCase() === 'agro');
  if (idxAgro !== -1) {
    const [agro] = tiposOrdenados.splice(idxAgro, 1);
    tiposOrdenados.push(agro);
  }

  // Hook para efectos parallax
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ 
      width: "100%", 
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f3f6fa 100%)",
      minHeight: "100vh", 
      paddingBottom: 48,
      position: 'relative'
    }}>
      {/* Elemento parallax de fondo */}
      <div 
        className="parallax-bg"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '120%',
          background: 'radial-gradient(circle at 20% 80%, rgba(14,165,233,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56,189,248,0.03) 0%, transparent 50%)',
          transform: `translateY(${scrollY * 0.5}px)`,
          zIndex: -1
        }}
      />
      {/* Navegación por tabs para mobile */}
      <MobileTabNavigation
        tiposVehiculo={tiposOrdenados}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showDestacados={destacados.length > 0}
        contadores={calcularContadores()}
      />
      
      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideRight {
          0%, 50% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(4px);
          }
        }
        
        /* Estilos para feedback de swipe mejorado */
        .catalogo-grid.swiping-left {
          transform: translateX(-8px);
          transition: transform 0.1s ease-out;
        }
        
        .catalogo-grid.swiping-right {
          transform: translateX(8px);
          transition: transform 0.1s ease-out;
        }
        
        .catalogo-grid.swipe-feedback {
          position: relative;
        }
        
        .catalogo-grid.swipe-feedback::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -30px;
          width: 20px;
          height: 20px;
          background: #0ea5e9;
          border-radius: 50%;
          opacity: 0;
          transform: translateY(-50%);
          transition: opacity 0.2s ease;
        }
        
        .catalogo-grid.swiping-left.swipe-feedback::after {
          opacity: 0.6;
          animation: pulseSwipe 0.3s ease;
        }
        
        @keyframes pulseSwipe {
          0% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-50%) scale(1.2); }
          100% { transform: translateY(-50%) scale(1); }
        }
        
        @media (max-width: 768px) {
          .catalogo-grid {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            gap: 0 !important;
            scroll-snap-type: x mandatory !important;
            scroll-behavior: smooth !important;
            padding-bottom: 8px;
            padding-left: 12px;
            padding-right: 12px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            position: relative;
            scroll-behavior: smooth;
            overscroll-behavior-x: contain;
          }
          
          .catalogo-grid::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            height: 100%;
            background: linear-gradient(to left, rgba(255,255,255,0.9), transparent);
            pointer-events: none;
            z-index: 1;
          }
          
          .catalogo-grid::-webkit-scrollbar {
            display: none;
          }
          
          .neumatico-card {
            min-width: 92vw !important;
            max-width: 92vw !important;
            flex: 0 0 92vw !important;
            scroll-snap-align: center !important;
            margin-left: 4px;
            margin-right: 4px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            background: #fff;
            border-radius: 24px;
            padding: 28px;
            border: 2px solid #e0f2fe;
            box-shadow: 0 6px 24px rgba(14,165,233,0.12);
            display: flex;
            flex-direction: column;
            min-height: 320px;
          }
          
          .neumatico-card:hover {
            box-shadow: 0 12px 32px rgba(14,165,233,0.18);
            transform: translateY(-4px);
            border-color: #0ea5e9;
          }
          
          .mobile-category-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 8px;
          }
        }
        
        @media (min-width: 769px) {
          .catalogo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 36px;
            padding: 0 20px;
            align-items: stretch;
          }
          .neumatico-card {
            min-width: 0;
            max-width: 100%;
            background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
            border-radius: 28px;
            padding: 36px;
            border: 2px solid #e0f2fe;
            box-shadow: 0 8px 32px rgba(14,165,233,0.12);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: row;
            align-items: center;
            min-height: 220px;
            position: relative;
            overflow: hidden;
          }
          .neumatico-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(14,165,233,0.03), transparent);
            transition: left 0.6s ease;
          }
          .neumatico-card:hover::before {
            left: 100%;
          }
          .neumatico-card:hover {
            box-shadow: 0 12px 32px rgba(14,165,233,0.18);
            transform: translateY(-4px);
            border-color: #0ea5e9;
          }
          .mobile-category-header {
            display: none;
          }
          .mobile-product-counter {
            display: none;
          }
        }
      `}</style>

      {/* Categoría Destacados */}
      {destacados.length > 0 && (
        <div key="destacados" style={{ marginBottom: 56 }} data-category="destacados">
          <div style={categoriaStyle}>
            <h2 className="section-title" style={{ fontSize: 28, fontWeight: 900, color: "#0ea5e9", margin: 0, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className={`fas ${getCategoriaIcon('destacados')} icon-float`} style={{ fontSize: 26, color: '#0ea5e9', minWidth: 28 }}></i>
              Destacados
            </h2>
            
            <SwipeHint show={showSwipeHint && destacados.length > 1} />
            
            <div 
              className="catalogo-grid"
              onScroll={(e) => handleScroll(e, 'destacados')}
            >
              {destacados.map((n, index) => (
                <NeumaticoCard
                  key={n.id}
                  neumatico={n}
                  index={index}
                  onClick={() => {
                    // Generar mensaje pre-escrito para WhatsApp
                    const mensaje = `Hola! Me interesa cotizar el neumático *${n.nombre}* de la marca ${n.marcas?.nombre || 'sin marca'}. ${n.descripcion ? `\n\nDescripción: ${n.descripcion}` : ''}\n\n¿Podrían enviarme información sobre disponibilidad y precio?\n\nGracias!`;
                    const numeroWhatsApp = "+5493515123456"; // Reemplazar con tu número real
                    const urlWhatsApp = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
                    window.open(urlWhatsApp, '_blank');
                  }}
                />
              ))}
            </div>
            
            <SwipeIndicator 
              totalItems={destacados.length}
              currentIndex={currentIndexes['destacados'] || 0}
              onDotClick={(index) => scrollToIndex('destacados', index)}
            />
          </div>
        </div>
      )}

      {tiposOrdenados.map(tipo => {
        const estaExpandida = categoriasExpandidas.includes(tipo.id);
        const neumaticos = neumaticosPorTipo[tipo.id] || [];
        const mostrarNeumaticos = estaExpandida ? neumaticos : neumaticos.slice(0, 3);
        return (
          <div key={tipo.id} style={{ marginBottom: 56 }} data-category={tipo.id}>
            <div style={categoriaStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 className="section-title" style={{ fontSize: 28, fontWeight: 900, color: "#0ea5e9", margin: 0, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`fas ${getCategoriaIcon(tipo.nombre)} icon-float`} style={{ fontSize: 26, color: '#0ea5e9', minWidth: 28 }}></i>
                  {tipo.nombre}
                </h2>
                {neumaticos.length > 3 && (
                  <button
                    style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 700, fontSize: 16, cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleExpandirCategoria(tipo.id)}
                  >
                    {estaExpandida ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
              
              <div 
                className="catalogo-grid"
                onScroll={(e) => handleScroll(e, tipo.id)}
              >
                {neumaticos.length === 0 ? (
                  <div style={{ color: "#64748b", fontSize: 16, padding: 24 }}>No hay neumáticos para este tipo.</div>
                ) : (
                  mostrarNeumaticos.map((n, index) => (
                    <NeumaticoCard
                      key={n.id}
                      neumatico={n}
                      index={index}
                      onClick={() => {
                        // Generar mensaje pre-escrito para WhatsApp
                        const mensaje = `Hola! Me interesa cotizar el neumático *${n.nombre}* de la marca ${n.marcas?.nombre || 'sin marca'}. ${n.descripcion ? `\n\nDescripción: ${n.descripcion}` : ''}\n\n¿Podrían enviarme información sobre disponibilidad y precio?\n\nGracias!`;
                        const numeroWhatsApp = "+5493515123456"; // Reemplazar con tu número real
                        const urlWhatsApp = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
                        window.open(urlWhatsApp, '_blank');
                      }}
                    />
                  ))
                )}
              </div>
              
              <SwipeIndicator 
                totalItems={mostrarNeumaticos.length}
                currentIndex={currentIndexes[tipo.id] || 0}
                onDotClick={(index) => scrollToIndex(tipo.id, index)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CatalogoNeumaticos;