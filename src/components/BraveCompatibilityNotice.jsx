"use client";
import { useState, useEffect } from 'react';

export default function BrowserCompatibilityNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [browserType, setBrowserType] = useState('');

  useEffect(() => {
    // Detectar tipo de navegador
    if (typeof window !== 'undefined') {
      const isBrave = navigator.brave && navigator.brave.isBrave;
      const isEdge = navigator.userAgent.includes('Edg/');
      const isDismissed = localStorage.getItem('browser-notice-dismissed');
      
      if (isBrave && !isDismissed) {
        setBrowserType('brave');
        setShowNotice(true);
      } else if (isEdge && !isDismissed) {
        setBrowserType('edge');
        setShowNotice(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowNotice(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('browser-notice-dismissed', 'true');
    }
  };

  const getNoticeContent = () => {
    if (browserType === 'brave') {
      return {
        title: 'Usuario de Brave Browser',
        message: 'Hemos optimizado el sitio para Brave. Si aún ves problemas, puedes hacer clic en el escudo 🛡️ y seleccionar "Shields Down"'
      };
    } else if (browserType === 'edge') {
      return {
        title: 'Usuario de Microsoft Edge',
        message: 'Si el sitio no carga correctamente, desactiva "Tracking Prevention" para este sitio en la configuración de privacidad'
      };
    }
    return { title: '', message: '' };
  };

  const { title, message } = getNoticeContent();

  if (!showNotice || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      zIndex: 10000,
      maxWidth: '320px',
      fontSize: '14px',
      lineHeight: '1.4'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ color: '#60a5fa', fontSize: '18px', marginTop: '2px' }}>
          🛡️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
            {title}
          </div>
          <div style={{ marginBottom: '10px' }}>
            {message}
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Entendido
          </button>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}