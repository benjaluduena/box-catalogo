"use client";
import { usePullToRefresh } from '../hooks/useTouchGestures';

export function PullToRefresh({ 
  onRefresh, 
  children, 
  enabled = true,
  loadingComponent = null 
}) {
  const { 
    touchRef, 
    isPulling, 
    pullDistance, 
    pullProgress, 
    isRefreshing 
  } = usePullToRefresh({
    onRefresh,
    enabled
  });

  const refreshThreshold = 80;
  const canRefresh = pullDistance >= refreshThreshold;

  return (
    <div 
      ref={touchRef}
      style={{ 
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Pull to refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: Math.max(pullDistance, isRefreshing ? 60 : 0),
            background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: isRefreshing ? 'height 0.3s ease' : 'none',
            zIndex: 10
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: Math.max(pullProgress * 2, 0.5)
          }}>
            {isRefreshing ? (
              <>
                <div style={{
                  width: 24,
                  height: 24,
                  border: '3px solid #e0f2fe',
                  borderTop: '3px solid #0ea5e9',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}>
                  <style jsx>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
                <span style={{
                  fontSize: 14,
                  color: '#0ea5e9',
                  fontWeight: 600
                }}>
                  Actualizando...
                </span>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 24,
                  color: canRefresh ? '#0ea5e9' : '#64748b',
                  transform: `rotate(${pullProgress * 180}deg)`,
                  transition: 'color 0.2s ease'
                }}>
                  ↓
                </div>
                <span style={{
                  fontSize: 14,
                  color: canRefresh ? '#0ea5e9' : '#64748b',
                  fontWeight: 600,
                  transition: 'color 0.2s ease'
                }}>
                  {canRefresh ? 'Suelta para actualizar' : 'Desliza hacia abajo'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${Math.max(pullDistance, isRefreshing ? 60 : 0)}px)`,
          transition: isRefreshing || !isPulling ? 'transform 0.3s ease' : 'none'
        }}
      >
        {isRefreshing && loadingComponent ? loadingComponent : children}
      </div>
    </div>
  );
}