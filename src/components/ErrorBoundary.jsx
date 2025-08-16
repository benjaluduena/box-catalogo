"use client";
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
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
            Oops! Algo salió mal
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            No pudimos cargar esta sección del catálogo. Por favor, intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
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
            Recargar página
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '24px',
              textAlign: 'left',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Detalles del error (desarrollo)
              </summary>
              <pre style={{
                fontSize: '12px',
                color: '#6b7280',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;