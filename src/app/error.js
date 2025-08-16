'use client';

import ErrorBoundary from '../components/ErrorBoundary';

export default function Error({ error, reset }) {
  return (
    <ErrorBoundary>
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.1)',
        border: '1px solid #fecaca',
        margin: '20px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          ⚠️
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#dc2626',
          marginBottom: '12px'
        }}>
          Error en la aplicación
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: 'linear-gradient(90deg, #dc2626, #ef4444)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <i className="fas fa-redo"></i>
          Reintentar
        </button>
      </div>
    </ErrorBoundary>
  );
}