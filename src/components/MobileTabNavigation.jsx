"use client";
import { useState } from 'react';

function MobileTabNavigation({ 
  tiposVehiculo, 
  activeTab, 
  onTabChange, 
  showDestacados = true,
  contadores = {}
}) {
  const [showAllTabs, setShowAllTabs] = useState(false);
  
  // Preparar pestañas incluyendo destacados si es necesario
  const allTabs = showDestacados 
    ? [{ id: 'destacados', nombre: 'Destacados' }, ...tiposVehiculo]
    : tiposVehiculo;
  
  const visibleTabs = showAllTabs ? allTabs : allTabs.slice(0, 4);
  const hiddenTabsCount = Math.max(0, allTabs.length - 4);

  const getCategoriaIcon = (nombre) => {
    if (!nombre) return "fa-box";
    const n = nombre.toLowerCase();
    if (n.includes("auto")) return "fa-car";
    if (n.includes("camioneta")) return "fa-truck-pickup";
    if (n.includes("camion")) return "fa-truck";
    if (n.includes("moto")) return "fa-motorcycle";
    if (n.includes("agro")) return "fa-tractor";
    if (n.includes("destacad")) return "fa-star";
    return "fa-box";
  };

  return (
    <>
      <style>{`
        @keyframes tabSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes tabPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
          .mobile-tab-navigation {
            position: sticky;
            top: 0;
            z-index: 100;
            background: #fff;
            border-bottom: 2px solid #e0f2fe;
            box-shadow: 0 2px 12px rgba(14,165,233,0.08);
            margin: 0 -16px 24px -16px;
            padding: 12px 16px 8px 16px;
          }
          
          .mobile-tabs-container {
            display: flex;
            overflow-x: auto;
            gap: 8px;
            padding: 4px 0;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-behavior: smooth;
          }
          
          .mobile-tabs-container::-webkit-scrollbar {
            display: none;
          }
          
          .mobile-tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            border-radius: 16px;
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            min-width: 80px;
            flex-shrink: 0;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            position: relative;
            animation: tabSlideIn 0.6s ease-out;
          }
          
          .mobile-tab.active {
            background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
            border-color: #0ea5e9;
            color: white;
            box-shadow: 0 6px 16px rgba(14,165,233,0.4);
            transform: scale(1.05);
          }
          
          .mobile-tab:not(.active):hover {
            background: #e0f2fe;
            border-color: #0ea5e9;
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 6px 16px rgba(14,165,233,0.2);
          }
          
          .mobile-tab-icon {
            font-size: 20px;
            color: inherit;
          }
          
          .mobile-tab-label {
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            line-height: 1.2;
            color: inherit;
          }
          
          .mobile-tab-counter {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #ef4444;
            color: white;
            font-size: 10px;
            font-weight: 700;
            border-radius: 10px;
            padding: 2px 6px;
            min-width: 18px;
            text-align: center;
            line-height: 1.2;
          }
          
          .mobile-tab.active .mobile-tab-counter {
            background: #fbbf24;
            color: #1f2937;
          }
          
          .show-more-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            border-radius: 16px;
            background: #f1f5f9;
            border: 2px dashed #94a3b8;
            min-width: 60px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .show-more-tab:hover {
            background: #e2e8f0;
            border-color: #64748b;
          }
          
          .show-more-icon {
            font-size: 16px;
            color: #64748b;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-tab-navigation {
            display: none;
          }
        }
      `}</style>
      
      <div className="mobile-tab-navigation">
        <div className="mobile-tabs-container">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-label={`Ver ${tab.nombre}`}
            >
              <i className={`fas ${getCategoriaIcon(tab.nombre)} mobile-tab-icon ${activeTab === tab.id ? 'icon-glow' : 'icon-float'}`}></i>
              <span className="mobile-tab-label">{tab.nombre}</span>
              {contadores[tab.id] > 0 && (
                <span className="mobile-tab-counter">
                  {contadores[tab.id] > 99 ? '99+' : contadores[tab.id]}
                </span>
              )}
            </button>
          ))}
          
          {hiddenTabsCount > 0 && !showAllTabs && (
            <button
              className="show-more-tab"
              onClick={() => setShowAllTabs(true)}
              aria-label={`Mostrar ${hiddenTabsCount} categorías más`}
            >
              <i className="fas fa-plus show-more-icon"></i>
            </button>
          )}
          
          {showAllTabs && (
            <button
              className="show-more-tab"
              onClick={() => setShowAllTabs(false)}
              aria-label="Mostrar menos categorías"
            >
              <i className="fas fa-minus show-more-icon"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileTabNavigation;