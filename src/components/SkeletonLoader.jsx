"use client";

// Skeleton para una tarjeta de neumático
export function NeumaticoCardSkeleton() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(14,165,233,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Banda de marca skeleton */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 18,
        background: '#f1f5f9',
        borderRadius: 12,
        padding: '2px 16px',
        height: '20px',
        width: '80px'
      }} className="skeleton-shimmer" />
      
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Imagen skeleton */}
        <div style={{
          width: 96,
          height: 96,
          borderRadius: 14,
          background: '#f1f5f9',
          flexShrink: 0
        }} className="skeleton-shimmer" />
        
        {/* Contenido skeleton */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Título */}
          <div style={{
            height: '24px',
            background: '#f1f5f9',
            borderRadius: '6px',
            width: '70%'
          }} className="skeleton-shimmer" />
          
          {/* Descripción */}
          <div style={{
            height: '18px',
            background: '#f1f5f9',
            borderRadius: '4px',
            width: '90%'
          }} className="skeleton-shimmer" />
          
          {/* Precio */}
          <div style={{
            height: '28px',
            background: '#f1f5f9',
            borderRadius: '6px',
            width: '50%',
            marginTop: '4px'
          }} className="skeleton-shimmer" />
          
          {/* Botón */}
          <div style={{
            height: '40px',
            background: '#f1f5f9',
            borderRadius: '8px',
            width: '120px',
            marginTop: '8px'
          }} className="skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para el grid completo de neumáticos
export function CatalogoGridSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: '24px'
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <NeumaticoCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton para una categoría completa
export function CategoriaSkeleton() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 28,
      boxShadow: '0 8px 32px rgba(14,165,233,0.10)',
      border: '1.5px solid #e0f2fe',
      padding: '36px 32px 40px 32px',
      margin: '0 auto',
      maxWidth: 1300,
      width: '100%',
      marginBottom: 56
    }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{
          height: '32px',
          background: '#f1f5f9',
          borderRadius: '8px',
          width: '200px'
        }} className="skeleton-shimmer" />
        
        <div style={{
          height: '20px',
          background: '#f1f5f9',
          borderRadius: '4px',
          width: '80px'
        }} className="skeleton-shimmer" />
      </div>
      
      {/* Grid skeleton */}
      <CatalogoGridSkeleton count={3} />
    </div>
  );
}

// Skeleton para filtros
export function FiltrosSkeleton() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 24,
      boxShadow: '0 4px 16px rgba(14,165,233,0.08)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        height: '24px',
        background: '#f1f5f9',
        borderRadius: '6px',
        width: '250px',
        marginBottom: '20px'
      }} className="skeleton-shimmer" />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16
      }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div style={{
              height: '16px',
              background: '#f1f5f9',
              borderRadius: '4px',
              width: '60%',
              marginBottom: '8px'
            }} className="skeleton-shimmer" />
            <div style={{
              height: '40px',
              background: '#f1f5f9',
              borderRadius: '8px',
              width: '100%'
            }} className="skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para página completa del catálogo
export function CatalogoCompleteSkeleton() {
  return (
    <div style={{ width: "100%", background: "#f3f6fa", minHeight: "100vh", paddingBottom: 32 }}>
      <style>{`
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .skeleton-shimmer::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: shimmer 2s infinite;
          content: '';
        }
        
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        
        @media (max-width: 768px) {
          .skeleton-shimmer {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        }
      `}</style>
      
      <FiltrosSkeleton />
      <CategoriaSkeleton />
      <CategoriaSkeleton />
      <CategoriaSkeleton />
    </div>
  );
}