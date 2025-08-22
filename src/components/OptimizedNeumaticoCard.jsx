"use client";
import { memo, useState, useCallback } from 'react';
import styles from '../styles/CatalogoNeumaticos.module.css';

const NeumaticoCard = memo(function NeumaticoCard({ 
  neumatico, 
  onClick, 
  isActive = false,
  ...props 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { nombre, descripcion, imagen, marcas } = neumatico;

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    onClick?.();
  }, [onClick]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  return (
    <article 
      className={`${styles.neumaticoCard} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${nombre} - ${marcas?.nombre || ''}`}
      data-keyboard-nav
      {...props}
    >
      {/* Banda de marca */}
      {marcas?.nombre && (
        <div className={styles.marcaBanda}>
          {marcas.nombre}
        </div>
      )}
      
      <div className={styles.cardContent}>
        {/* Imagen mejorada */}
        <div className={styles.imageContainer}>
          {!imageLoaded && (
            <div 
              className={styles.productImage}
              style={{ 
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fas fa-tire" style={{ color: '#cbd5e1', fontSize: '32px' }}></i>
            </div>
          )}
          <img
            src={imagen || "/images/placeholder-tire.png"}
            alt={`Neumático ${nombre} ${marcas?.nombre || ''}`}
            className={styles.productImage}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        
        {/* Info del producto */}
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>
            {nombre}
          </h3>
          
          {descripcion && (
            <p className={`${styles.productDescription} ${styles.hideMobile}`}>
              {descripcion}
            </p>
          )}
          
          
          <div className={styles.actionButtons}>
            <button
              className={`btn btn-primary ${styles.verMasProductBtn}`}
              onClick={(e) => { 
                e.stopPropagation(); 
                onClick?.(); 
              }}
              aria-label={`Ver más detalles de ${nombre}`}
            >
              <i className="fas fa-eye" style={{ fontSize: 18 }}></i>
              <span className="ver-mas-text">
                <span style={{ fontSize: 16 }}>Ver más</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export default NeumaticoCard;