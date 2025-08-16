"use client";
import { useEffect, useRef } from 'react';

export function AccessibilityAnnouncer({ 
  announcement = '', 
  priority = 'polite',
  clearAfter = 1000 
}) {
  const announcerRef = useRef();

  useEffect(() => {
    if (announcement && announcerRef.current) {
      announcerRef.current.textContent = announcement;
      
      // Limpiar el anuncio después del tiempo especificado
      const timer = setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [announcement, clearAfter]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    />
  );
}

export function LoadingAnnouncer({ isLoading, loadingMessage = "Cargando productos...", completeMessage = "Productos cargados" }) {
  return (
    <AccessibilityAnnouncer
      announcement={isLoading ? loadingMessage : completeMessage}
      priority="polite"
    />
  );
}

export function FilterAnnouncer({ resultCount, filterType = "filtro" }) {
  const announcement = resultCount === 0 
    ? `No se encontraron productos con este ${filterType}`
    : resultCount === 1
      ? `Se encontró 1 producto`
      : `Se encontraron ${resultCount} productos`;

  return (
    <AccessibilityAnnouncer
      announcement={announcement}
      priority="polite"
      clearAfter={2000}
    />
  );
}