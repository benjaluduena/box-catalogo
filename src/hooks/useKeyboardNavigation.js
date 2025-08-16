"use client";
import { useEffect, useCallback, useState } from 'react';

export function useKeyboardNavigation({
  items = [],
  onSelect,
  onEscape,
  enabled = true,
  wrapAround = true,
  selector = '[data-keyboard-nav]'
}) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleKeyDown = useCallback((event) => {
    if (!enabled || items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setCurrentIndex(prev => {
          if (wrapAround) {
            return prev >= items.length - 1 ? 0 : prev + 1;
          }
          return Math.min(prev + 1, items.length - 1);
        });
        break;

      case 'ArrowUp':
        event.preventDefault();
        setCurrentIndex(prev => {
          if (wrapAround) {
            return prev <= 0 ? items.length - 1 : prev - 1;
          }
          return Math.max(prev - 1, 0);
        });
        break;

      case 'ArrowRight':
        if (event.target.tagName !== 'INPUT') {
          event.preventDefault();
          setCurrentIndex(prev => {
            if (wrapAround) {
              return prev >= items.length - 1 ? 0 : prev + 1;
            }
            return Math.min(prev + 1, items.length - 1);
          });
        }
        break;

      case 'ArrowLeft':
        if (event.target.tagName !== 'INPUT') {
          event.preventDefault();
          setCurrentIndex(prev => {
            if (wrapAround) {
              return prev <= 0 ? items.length - 1 : prev - 1;
            }
            return Math.max(prev - 1, 0);
          });
        }
        break;

      case 'Enter':
      case ' ':
        if (currentIndex >= 0 && currentIndex < items.length && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          onSelect?.(items[currentIndex], currentIndex);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setCurrentIndex(-1);
        onEscape?.();
        break;

      case 'Home':
        if (event.target.tagName !== 'INPUT') {
          event.preventDefault();
          setCurrentIndex(0);
        }
        break;

      case 'End':
        if (event.target.tagName !== 'INPUT') {
          event.preventDefault();
          setCurrentIndex(items.length - 1);
        }
        break;
    }
  }, [enabled, items, currentIndex, wrapAround, onSelect, onEscape]);

  // Scroll automático al elemento activo
  useEffect(() => {
    if (currentIndex >= 0 && enabled) {
      const elements = document.querySelectorAll(selector);
      const activeElement = elements[currentIndex];
      
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
        
        // Focus para accesibilidad
        if (activeElement.focus) {
          activeElement.focus();
        }
      }
    }
  }, [currentIndex, enabled, selector]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  const setActiveIndex = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const resetNavigation = useCallback(() => {
    setCurrentIndex(-1);
  }, []);

  return {
    currentIndex,
    setActiveIndex,
    resetNavigation,
    isActive: (index) => index === currentIndex
  };
}

export function useArrowKeyNavigation({
  containerRef,
  itemSelector = '[data-keyboard-nav]',
  onActivate,
  enabled = true
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const getItems = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(itemSelector));
  }, [containerRef, itemSelector]);

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    const items = getItems();
    if (items.length === 0) return;

    let newIndex = focusedIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (focusedIndex + 1) % items.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = focusedIndex === 0 ? items.length - 1 : focusedIndex - 1;
        break;
      case 'Enter':
        event.preventDefault();
        onActivate?.(items[focusedIndex], focusedIndex);
        return;
      case 'Escape':
        event.preventDefault();
        items[focusedIndex]?.blur();
        return;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    items[newIndex]?.focus();
  }, [enabled, focusedIndex, getItems, onActivate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, handleKeyDown, enabled]);

  return { focusedIndex, setFocusedIndex };
}