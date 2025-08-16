"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onPullToRefresh,
  threshold = 50,
  velocity = 0.3,
  enabled = true
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchRef = useRef();
  const startTimeRef = useRef();

  const minSwipeDistance = threshold;

  const onTouchStart = useCallback((e) => {
    if (!enabled) return;
    
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    startTimeRef.current = Date.now();
  }, [enabled]);

  const onTouchMove = useCallback((e) => {
    if (!enabled || !touchStart) return;

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };

    // Pull to refresh logic
    if (onPullToRefresh && window.scrollY === 0) {
      const deltaY = currentTouch.y - touchStart.y;
      if (deltaY > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(deltaY, 150));
        
        // Prevent default scrolling when pulling
        e.preventDefault();
      }
    }

    setTouchEnd(currentTouch);
  }, [enabled, touchStart, onPullToRefresh]);

  const onTouchEnd = useCallback(() => {
    if (!enabled) return;

    if (!touchStart || !touchEnd) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    const distance = {
      x: touchStart.x - touchEnd.x,
      y: touchStart.y - touchEnd.y
    };

    const timeDiff = Date.now() - startTimeRef.current;
    const velocityX = Math.abs(distance.x) / timeDiff;
    const velocityY = Math.abs(distance.y) / timeDiff;

    // Check for pull to refresh
    if (isPulling && pullDistance > 80 && onPullToRefresh) {
      onPullToRefresh();
    }

    // Check for swipes
    const isLeftSwipe = distance.x > minSwipeDistance && velocityX > velocity;
    const isRightSwipe = distance.x < -minSwipeDistance && velocityX > velocity;
    const isUpSwipe = distance.y > minSwipeDistance && velocityY > velocity;
    const isDownSwipe = distance.y < -minSwipeDistance && velocityY > velocity;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
    if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }

    // Reset states
    setTouchStart(null);
    setTouchEnd(null);
    setIsPulling(false);
    setPullDistance(0);
  }, [
    enabled, touchStart, touchEnd, isPulling, pullDistance,
    onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPullToRefresh,
    minSwipeDistance, velocity
  ]);

  useEffect(() => {
    const element = touchRef.current;
    if (!element || !enabled) return;

    const options = { passive: false };

    element.addEventListener('touchstart', onTouchStart, options);
    element.addEventListener('touchmove', onTouchMove, options);
    element.addEventListener('touchend', onTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, onTouchStart, onTouchMove, onTouchEnd]);

  return {
    touchRef,
    isPulling,
    pullDistance,
    pullProgress: Math.min(pullDistance / 80, 1)
  };
}

export function useSwipeNavigation({
  onNext,
  onPrevious,
  enabled = true,
  threshold = 50,
  velocity = 0.3
}) {
  return useTouchGestures({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    enabled,
    threshold,
    velocity
  });
}

export function usePullToRefresh({
  onRefresh,
  enabled = true,
  threshold = 80
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  const { touchRef, isPulling, pullDistance, pullProgress } = useTouchGestures({
    onPullToRefresh: handleRefresh,
    enabled,
    threshold
  });

  return {
    touchRef,
    isPulling,
    pullDistance,
    pullProgress,
    isRefreshing
  };
}