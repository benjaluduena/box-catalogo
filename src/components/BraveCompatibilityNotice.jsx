"use client";
import { useState, useEffect } from 'react';

export default function BraveCompatibilityNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Detectar si es Brave Browser
    const isBrave = navigator.brave && navigator.brave.isBrave;
    const isDismissed = localStorage.getItem('brave-notice-dismissed');
    
    if (isBrave && !isDismissed) {
      setShowNotice(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowNotice(false);
    localStorage.setItem('brave-notice-dismissed', 'true');
  };

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
            Usuario de Brave Browser
          </div>
          <div style={{ marginBottom: '10px' }}>
            Si ves problemas de carga, haz clic en el escudo de Brave y selecciona "Shields Down"
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