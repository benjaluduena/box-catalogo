"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll({
  fetchMore,
  hasMore = true,
  threshold = 100,
  initialPage = 1,
  enabled = true
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(initialPage);
  const observerRef = useRef();
  const loadingRef = useRef();

  const handleIntersect = useCallback(async () => {
    if (isFetching || !hasMore || !enabled) return;

    setIsFetching(true);
    try {
      await fetchMore(page);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error al cargar más elementos:', error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchMore, page, isFetching, hasMore, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const currentRef = loadingRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleIntersect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: `${threshold}px`
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [handleIntersect, threshold, enabled]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setIsFetching(false);
  }, [initialPage]);

  return {
    isFetching,
    loadingRef,
    reset,
    page
  };
}

export function useVirtualScroll({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    ...item,
    index: startIndex + index
  }));
  
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}