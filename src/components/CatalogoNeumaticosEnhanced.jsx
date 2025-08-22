"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from '../styles/CatalogoNeumaticos.module.css';

// Componentes optimizados
import ErrorBoundary from './ErrorBoundary';
import { CatalogoCompleteSkeleton, CategoriaSkeleton } from './SkeletonLoader';
import OptimizedNeumaticoCard from './OptimizedNeumaticoCard';
import { SimplifiedFilters } from './SimplifiedFilters';
import { PullToRefresh } from './PullToRefresh';
import { AccessibilityAnnouncer, FilterAnnouncer, LoadingAnnouncer } from './AccessibilityAnnouncer';

// Hooks personalizados
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSwipeNavigation } from '../hooks/useTouchGestures';

// Componente para indicadores de deslizamiento optimizado
function SwipeIndicator({ totalItems, currentIndex, onDotClick, categoryId }) {
  if (totalItems <= 1) return null;
  
  return (
    <div 
      className={styles.swipeIndicators}
      role="tablist"
      aria-label={`Navegación de productos de ${categoryId}`}
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className={`${styles.swipeDot} ${currentIndex === index ? styles.active : ''}`}
          role="tab"
          aria-selected={currentIndex === index}
          aria-label={`Ir al producto ${index + 1} de ${totalItems}`}
          aria-controls={`product-${categoryId}-${index}`}
        />
      ))}
    </div>
  );
}

// Componente para mostrar texto de ayuda de deslizamiento
function SwipeHint({ show }) {
  if (!show) return null;
  
  return (
    <div className={styles.swipeHint} role="status" aria-live="polite">
      <i className={`fas fa-hand-pointer ${styles.swipeHintIcon}`}></i>
      Desliza para ver más productos
      <i className={`fas fa-arrow-right ${styles.swipeHintArrow}`}></i>
    </div>
  );
}

// Componente para el modal Quick View mejorado
function QuickViewModal({ neumatico, onClose, onViewFull }) {
  if (!neumatico) return null;
  
  return (
    <div 
      style={{
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
      }} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div 
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 24,
          maxWidth: 500,
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }} 
        onClick={e => e.stopPropagation()}
      >
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
          aria-label="Cerrar vista rápida"
        >
          ×
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img
            src={neumatico.imagen || "/images/placeholder-tire.png"}
            alt={`Neumático ${neumatico.nombre}`}
            style={{
              width: 150,
              height: 150,
              objectFit: 'contain',
              borderRadius: 12,
              marginBottom: 16
            }}
          />
          <h3 id="quickview-title" style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9', margin: '0 0 8px 0' }}>
            {neumatico.nombre}
          </h3>
          <p style={{ color: '#64748b', fontSize: 16, fontWeight: 600, margin: '0 0 16px 0' }}>
            {neumatico.marcas?.nombre}
          </p>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
            {neumatico.descripcion}
          </p>
          <button
            onClick={() => onViewFull(neumatico.id)}
            style={{
              background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
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
              margin: '0 auto'
            }}
            aria-label={`Ver detalles completos de ${neumatico.nombre}`}
          >
            <i className="fas fa-eye"></i>
            Ver detalles completos
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogoNeumaticosEnhanced() {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [neumaticosPorTipo, setNeumaticosPorTipo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Estados para filtros y ordenamiento
  const [filtros, setFiltros] = useState({
    marcaSeleccionada: '',
    marcasMultiples: [],
    busqueda: ''
  });
  const [ordenamiento, setOrdenamiento] = useState('nombre-asc');
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [quickViewNeumatico, setQuickViewNeumatico] = useState(null);
  const [allNeumaticos, setAllNeumaticos] = useState([]);
  
  // Estados para infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Navegación por teclado
  const { currentIndex, setActiveIndex } = useKeyboardNavigation({
    items: destacados,
    onSelect: (neumatico) => router.push(`/catalogo/${neumatico.id}`),
    enabled: true,
    selector: '[data-keyboard-nav]'
  });

  // Generar sugerencias de búsqueda
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set();
    allNeumaticos.forEach(n => {
      if (n.nombre) suggestions.add(n.nombre);
      if (n.marcas?.nombre) suggestions.add(n.marcas.nombre);
      if (n.descripcion) {
        n.descripcion.split(' ').forEach(word => {
          if (word.length > 3) suggestions.add(word);
        });
      }
    });
    return Array.from(suggestions).slice(0, 10);
  }, [allNeumaticos]);

  const fetchTiposYNeumaticos = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener tipos de vehículo
      const { data: tipos, error: errorTipos } = await supabase
        .from("tipos_vehiculo")
        .select("id, nombre")
        .order("nombre");
        
      if (errorTipos) throw errorTipos;
      setTiposVehiculo(tipos || []);
      
      // Obtener neumáticos agrupados por tipo
      const { data: neumaticos, error: errorNeumaticos } = await supabase
        .from("neumaticos")
        .select("*, marcas(id, nombre, logo), tipos_vehiculo(nombre)")
        .order("id", { ascending: true });
        
      if (errorNeumaticos) throw errorNeumaticos;
      
      setAllNeumaticos(neumaticos || []);
      
      // Agrupar neumáticos por tipo_id
      const agrupados = {};
      tipos?.forEach(tipo => {
        agrupados[tipo.id] = [];
      });
      neumaticos?.forEach(n => {
        if (n.tipo_id && agrupados[n.tipo_id]) {
          agrupados[n.tipo_id].push(n);
        }
      });
      setNeumaticosPorTipo(agrupados);
      
      // Filtrar destacados
      setDestacados(neumaticos?.filter(n => n.destacado) || []);
      
      // Obtener marcas únicas para el filtro
      const marcasUnicas = [...new Map(
        neumaticos?.map(n => [n.marcas?.id, n.marcas])
          .filter(([id, marca]) => marca && id)
      ).values()];
      
      setMarcasDisponibles(marcasUnicas);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposYNeumaticos();

    // Ocultar hint después de 5 segundos
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [fetchTiposYNeumaticos]);

  // Infinite scroll para destacados
  const { isFetching, loadingRef } = useInfiniteScroll({
    fetchMore: async () => {
      // Simular carga de más productos
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    hasMore,
    enabled: destacados.length > 0
  });

  // Manejar expansión de categorías
  const handleExpandirCategoria = useCallback((tipoId) => {
    setCategoriasExpandidas((prev) =>
      prev.includes(tipoId)
        ? prev.filter((id) => id !== tipoId)
        : [...prev, tipoId]
    );
  }, []);

  // Función para manejar el scroll y actualizar el índice actual
  const handleScroll = useCallback((e, categoryId) => {
    const container = e.target;
    const cardWidth = container.children[0]?.offsetWidth || 0;
    const scrollLeft = container.scrollLeft;
    const currentIndex = Math.round(scrollLeft / cardWidth);
    
    setCurrentIndexes(prev => ({
      ...prev,
      [categoryId]: currentIndex
    }));
  }, []);

  // Función para navegar a un producto específico
  const scrollToIndex = useCallback((categoryId, index) => {
    const container = document.querySelector(`[data-category="${categoryId}"] .${styles.catalogoGrid}`);
    if (container) {
      const cardWidth = container.children[0]?.offsetWidth || 0;
      container.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  }, []);

  // Función para filtrar y ordenar neumáticos
  const filtrarYOrdenarNeumaticos = useCallback((neumaticos) => {
    let resultado = [...neumaticos];

    // Aplicar filtros
    if (filtros.marcasMultiples && filtros.marcasMultiples.length > 0) {
      resultado = resultado.filter(n => {
        const marcaId = n.marcas?.id?.toString();
        const includes = filtros.marcasMultiples.map(id => id.toString()).includes(marcaId);
        return includes;
      });
    } else if (filtros.marcaSeleccionada !== '') {
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
      case 'nombre-asc':
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'marca-asc':
        resultado.sort((a, b) => (a.marcas?.nombre || '').localeCompare(b.marcas?.nombre || ''));
        break;
      case 'relevancia':
        // Ordenar por relevancia de búsqueda si hay término de búsqueda
        if (filtros.busqueda) {
          const busquedaLower = filtros.busqueda.toLowerCase();
          resultado.sort((a, b) => {
            const scoreA = (a.nombre?.toLowerCase().includes(busquedaLower) ? 10 : 0) +
                          (a.marcas?.nombre?.toLowerCase().includes(busquedaLower) ? 5 : 0);
            const scoreB = (b.nombre?.toLowerCase().includes(busquedaLower) ? 10 : 0) +
                          (b.marcas?.nombre?.toLowerCase().includes(busquedaLower) ? 5 : 0);
            return scoreB - scoreA;
          });
        }
        break;
      default:
        break;
    }
    
    return resultado;
  }, [filtros, ordenamiento]);

  // Función para obtener el icono según el nombre de la categoría
  const getCategoriaIcon = useCallback((nombre) => {
    if (!nombre) return "fa-box";
    const n = nombre.toLowerCase();
    if (n.includes("auto")) return "fa-car";
    if (n.includes("camioneta")) return "fa-truck-pickup";
    if (n.includes("camion")) return "fa-truck";
    if (n.includes("moto")) return "fa-motorcycle";
    if (n.includes("agro")) return "fa-tractor";
    if (n.includes("destacad")) return "fa-star";
    return "fa-box";
  }, []);

  // Swipe navigation para mobile
  const { touchRef } = useSwipeNavigation({
    onNext: () => {
      // Implementar navegación siguiente
    },
    onPrevious: () => {
      // Implementar navegación anterior
    },
    enabled: true
  });

  if (error) {
    return (
      <ErrorBoundary>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Error al cargar el catálogo</h2>
          <p>{error}</p>
          <button onClick={() => fetchTiposYNeumaticos(true)}>
            Reintentar
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  if (loading) {
    return (
      <ErrorBoundary>
        <CatalogoCompleteSkeleton />
        <LoadingAnnouncer isLoading={loading} />
      </ErrorBoundary>
    );
  }

  if (!tiposVehiculo.length) {
    return (
      <ErrorBoundary>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No hay tipos de vehículo disponibles.</p>
          <button onClick={() => fetchTiposYNeumaticos(true)}>
            Recargar
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  // Mover el tipo 'Agro' al final si existe
  const tiposOrdenados = [...tiposVehiculo];
  const idxAgro = tiposOrdenados.findIndex(t => t.nombre && t.nombre.toLowerCase() === 'agro');
  if (idxAgro !== -1) {
    const [agro] = tiposOrdenados.splice(idxAgro, 1);
    tiposOrdenados.push(agro);
  }

  // Aplicar filtros a destacados
  const destacadosFiltrados = filtrarYOrdenarNeumaticos(destacados);

  return (
    <ErrorBoundary>
      <div className={styles.catalogo} ref={touchRef}>
        <PullToRefresh 
          onRefresh={() => fetchTiposYNeumaticos(true)}
          enabled={true}
        >
          <AccessibilityAnnouncer />
          <LoadingAnnouncer isLoading={loading} />
          <FilterAnnouncer resultCount={destacadosFiltrados.length} filterType="filtro" />

          {/* Filtros simplificados */}
          <SimplifiedFilters
            filtros={filtros}
            setFiltros={setFiltros}
            ordenamiento={ordenamiento}
            setOrdenamiento={setOrdenamiento}
            marcasDisponibles={marcasDisponibles}
            mostrarFiltros={mostrarFiltros}
            setMostrarFiltros={setMostrarFiltros}
            searchSuggestions={searchSuggestions}
          />

          {/* Categoría Destacados */}
          {destacadosFiltrados.length > 0 && (
            <div key="destacados" className={styles.categoria} data-category="destacados">
              <div className={styles.categoriaHeader}>
                <h2 className={styles.categoriaTitle}>
                  <i className={`fas ${getCategoriaIcon('destacados')} ${styles.categoriaIcon}`}></i>
                  Destacados
                </h2>
              </div>
              
              <SwipeHint show={showSwipeHint && destacadosFiltrados.length > 1} />
              
              <div 
                className={styles.catalogoGrid}
                onScroll={(e) => handleScroll(e, 'destacados')}
                role="region"
                aria-label="Productos destacados"
              >
                {destacadosFiltrados.map((n, index) => (
                  <OptimizedNeumaticoCard
                    key={n.id}
                    neumatico={n}
                    onClick={() => router.push(`/catalogo/${n.id}`)}
                    isActive={currentIndex === index}
                    id={`product-destacados-${index}`}
                    aria-setsize={destacadosFiltrados.length}
                    aria-posinset={index + 1}
                  />
                ))}
              </div>
              
              <SwipeIndicator 
                totalItems={destacadosFiltrados.length}
                currentIndex={currentIndexes['destacados'] || 0}
                onDotClick={(index) => scrollToIndex('destacados', index)}
                categoryId="destacados"
              />
            </div>
          )}

          {/* Categorías por tipo de vehículo */}
          {tiposOrdenados.map(tipo => {
            const estaExpandida = categoriasExpandidas.includes(tipo.id);
            const neumaticos = neumaticosPorTipo[tipo.id] || [];
            const neumaticosFiltrados = filtrarYOrdenarNeumaticos(neumaticos);
            const mostrarNeumaticos = estaExpandida ? neumaticosFiltrados : neumaticosFiltrados.slice(0, 3);
            
            return (
              <div key={tipo.id} className={styles.categoria} data-category={tipo.id}>
                <div className={styles.categoriaHeader}>
                  <h2 className={styles.categoriaTitle}>
                    <i className={`fas ${getCategoriaIcon(tipo.nombre)} ${styles.categoriaIcon}`}></i>
                    {tipo.nombre}
                  </h2>
                  {neumaticosFiltrados.length > 3 && (
                    <button
                      className={styles.verMasBtn}
                      onClick={() => handleExpandirCategoria(tipo.id)}
                      aria-expanded={estaExpandida}
                      aria-controls={`categoria-${tipo.id}-productos`}
                    >
                      {estaExpandida ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>
                
                <div 
                  id={`categoria-${tipo.id}-productos`}
                  className={styles.catalogoGrid}
                  onScroll={(e) => handleScroll(e, tipo.id)}
                  role="region"
                  aria-label={`Neumáticos para ${tipo.nombre}`}
                >
                  {neumaticosFiltrados.length === 0 ? (
                    <div style={{ color: "#64748b", fontSize: 16, padding: 24 }}>
                      No hay neumáticos para este tipo con los filtros aplicados.
                    </div>
                  ) : (
                    mostrarNeumaticos.map((n, index) => (
                      <OptimizedNeumaticoCard
                        key={n.id}
                        neumatico={n}
                        onClick={() => router.push(`/catalogo/${n.id}`)}
                        id={`product-${tipo.id}-${index}`}
                        aria-setsize={mostrarNeumaticos.length}
                        aria-posinset={index + 1}
                      />
                    ))
                  )}
                </div>
                
                <SwipeIndicator 
                  totalItems={mostrarNeumaticos.length}
                  currentIndex={currentIndexes[tipo.id] || 0}
                  onDotClick={(index) => scrollToIndex(tipo.id, index)}
                  categoryId={tipo.nombre}
                />
              </div>
            );
          })}

          {/* Loading indicator para infinite scroll */}
          {isFetching && (
            <div ref={loadingRef} style={{ padding: '20px', textAlign: 'center' }}>
              <CategoriaSkeleton />
            </div>
          )}

          {/* Modal Quick View */}
          <QuickViewModal
            neumatico={quickViewNeumatico}
            onClose={() => setQuickViewNeumatico(null)}
            onViewFull={(id) => {
              setQuickViewNeumatico(null);
              router.push(`/catalogo/${id}`);
            }}
          />
        </PullToRefresh>
      </div>
    </ErrorBoundary>
  );
}

export default CatalogoNeumaticosEnhanced;