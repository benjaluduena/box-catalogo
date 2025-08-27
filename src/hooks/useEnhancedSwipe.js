"use client";
import { useEffect, useRef, useCallback } from 'react';

export function useEnhancedSwipe(containerRef, onSwipeLeft, onSwipeRight, threshold = 50) {
  const startTouch = useRef({ x: 0, y: 0 });
  const currentTouch = useRef({ x: 0, y: 0 });
  const isScrolling = useRef(false);
  const isSwipeActive = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    startTouch.current = { x: touch.clientX, y: touch.clientY };
    currentTouch.current = { x: touch.clientX, y: touch.clientY };
    isScrolling.current = false;
    isSwipeActive.current = false;
  }, [containerRef]);

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !startTouch.current) return;

    const touch = e.touches[0];
    currentTouch.current = { x: touch.clientX, y: touch.clientY };

    const deltaX = touch.clientX - startTouch.current.x;
    const deltaY = touch.clientY - startTouch.current.y;

    // Determinar si es scroll vertical o swipe horizontal
    if (!isScrolling.current && !isSwipeActive.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isScrolling.current = true;
      } else if (Math.abs(deltaX) > 10) {
        isSwipeActive.current = true;
        e.preventDefault(); // Prevenir scroll durante swipe horizontal
      }
    }

    // Si es swipe horizontal activo, agregar feedback visual
    if (isSwipeActive.current && Math.abs(deltaX) > threshold * 0.3) {
      const container = containerRef.current;
      if (container) {
        // Añadir clase para feedback visual
        if (deltaX > 0) {
          container.classList.add('swiping-right');
          container.classList.remove('swiping-left');
        } else {
          container.classList.add('swiping-left');
          container.classList.remove('swiping-right');
        }
      }
    }
  }, [containerRef, threshold]);

  const handleTouchEnd = useCallback((e) => {
    if (!containerRef.current || isScrolling.current) return;

    const deltaX = currentTouch.current.x - startTouch.current.x;
    const deltaY = currentTouch.current.y - startTouch.current.y;

    // Limpiar clases de feedback visual
    const container = containerRef.current;
    if (container) {
      container.classList.remove('swiping-left', 'swiping-right');
    }

    // Solo procesar si fue un swipe horizontal claro
    if (isSwipeActive.current && Math.abs(deltaX) > threshold && Math.abs(deltaY) < 100) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset
    startTouch.current = { x: 0, y: 0 };
    currentTouch.current = { x: 0, y: 0 };
    isScrolling.current = false;
    isSwipeActive.current = false;
  }, [containerRef, onSwipeLeft, onSwipeRight, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Opciones pasivas para mejor performance
    const options = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isSwipeActive: isSwipeActive.current
  };
}