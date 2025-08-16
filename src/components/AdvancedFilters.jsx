"use client";
import { useState, useEffect, useRef } from 'react';
import { SearchWithSuggestions } from './SearchWithSuggestions';

function PriceRangeSlider({ min, max, value, onChange, formatValue }) {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef();

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = (e) => {
    if (isDragging === null || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = min + ((max - min) * percentage) / 100;

    const newRange = [...value];
    newRange[isDragging] = Math.round(newValue);

    if (isDragging === 0 && newRange[0] >= newRange[1]) {
      newRange[0] = newRange[1] - 1;
    }
    if (isDragging === 1 && newRange[1] <= newRange[0]) {
      newRange[1] = newRange[0] + 1;
    }

    onChange(newRange);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div style={{ padding: '0 8px' }}>
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          height: '6px',
          background: '#e2e8f0',
          borderRadius: '3px',
          margin: '20px 0'
        }}
      >
        {/* Track activo */}
        <div
          style={{
            position: 'absolute',
            height: '100%',
            background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
            borderRadius: '3px',
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
          }}
        />
        
        {/* Thumb izquierdo */}
        <div
          onMouseDown={handleMouseDown(0)}
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: '#0ea5e9',
            borderRadius: '50%',
            border: '3px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            left: `${getPercentage(value[0])}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: isDragging === 0 ? 'none' : 'all 0.2s ease'
          }}
          aria-label={`Precio mínimo: ${formatValue(value[0])}`}
          role="slider"
          tabIndex="0"
        />
        
        {/* Thumb derecho */}
        <div
          onMouseDown={handleMouseDown(1)}
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: '#0ea5e9',
            borderRadius: '50%',
            border: '3px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            left: `${getPercentage(value[1])}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: isDragging === 1 ? 'none' : 'all 0.2s ease'
          }}
          aria-label={`Precio máximo: ${formatValue(value[1])}`}
          role="slider"
          tabIndex="0"
        />
      </div>
      
      {/* Labels de valores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
    </div>
  );
}

function MultiSelectDropdown({ options, selected, onChange, placeholder, maxHeight = '200px' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionId) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId];
    onChange(newSelected);
  };

  const selectedLabels = options
    .filter(option => selected.includes(option.id))
    .map(option => option.nombre);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          background: '#fff',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span style={{ 
          color: selectedLabels.length > 0 ? '#374151' : '#9ca3af',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {selectedLabels.length > 0 
            ? selectedLabels.length === 1 
              ? selectedLabels[0]
              : `${selectedLabels.length} seleccionadas`
            : placeholder
          }
        </span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight,
            overflowY: 'auto',
            marginTop: '4px'
          }}
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map(option => (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: selected.includes(option.id) ? '#f0f9ff' : 'transparent'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.backgroundColor = selected.includes(option.id) ? '#f0f9ff' : 'transparent'}
              role="option"
              aria-selected={selected.includes(option.id)}
            >
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #d1d5db',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected.includes(option.id) ? '#0ea5e9' : '#fff',
                borderColor: selected.includes(option.id) ? '#0ea5e9' : '#d1d5db'
              }}>
                {selected.includes(option.id) && (
                  <i className="fas fa-check" style={{ fontSize: '10px', color: '#fff' }}></i>
                )}
              </div>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {option.nombre}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdvancedFilters({
  filtros,
  setFiltros,
  ordenamiento,
  setOrdenamiento,
  marcasDisponibles,
  mostrarFiltros,
  setMostrarFiltros,
  priceRange = { min: 0, max: 1000000 },
  searchSuggestions = []
}) {
  const [precioRange, setPrecioRange] = useState([
    parseInt(filtros.precioMin) || priceRange.min,
    parseInt(filtros.precioMax) || priceRange.max
  ]);

  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState(
    filtros.marcaSeleccionada ? [filtros.marcaSeleccionada] : []
  );

  // Actualizar filtros cuando cambia el rango de precio
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltros(prev => ({
        ...prev,
        precioMin: precioRange[0].toString(),
        precioMax: precioRange[1].toString()
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [precioRange, setFiltros]);

  // Actualizar filtros cuando cambian las marcas seleccionadas
  useEffect(() => {
    setFiltros(prev => ({
      ...prev,
      marcaSeleccionada: marcasSeleccionadas.length === 1 ? marcasSeleccionadas[0] : '',
      marcasMultiples: marcasSeleccionadas
    }));
  }, [marcasSeleccionadas, setFiltros]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const limpiarFiltros = () => {
    setFiltros({
      precioMin: '',
      precioMax: '',
      marcaSeleccionada: '',
      marcasMultiples: [],
      busqueda: ''
    });
    setOrdenamiento('nombre-asc');
    setPrecioRange([priceRange.min, priceRange.max]);
    setMarcasSeleccionadas([]);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 24,
      boxShadow: '0 4px 16px rgba(14,165,233,0.08)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: mostrarFiltros ? 20 : 0 
      }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: '#0ea5e9', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8 
        }}>
          <i className="fas fa-filter"></i>
          Filtros y Búsqueda Avanzada
        </h3>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0ea5e9',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f9ff'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          aria-expanded={mostrarFiltros}
          aria-controls="filtros-panel"
        >
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
          <i className={`fas fa-chevron-${mostrarFiltros ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      {mostrarFiltros && (
        <div id="filtros-panel" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20
        }}>
          {/* Búsqueda mejorada */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8, 
              color: '#374151',
              fontSize: '14px'
            }}>
              Búsqueda:
            </label>
            <SearchWithSuggestions
              value={filtros.busqueda}
              onChange={(value) => setFiltros(prev => ({ ...prev, busqueda: value }))}
              suggestions={searchSuggestions}
              placeholder="Buscar por nombre, marca, descripción..."
            />
          </div>

          {/* Rango de precios visual */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8, 
              color: '#374151',
              fontSize: '14px'
            }}>
              Rango de precios:
            </label>
            <PriceRangeSlider
              min={priceRange.min}
              max={priceRange.max}
              value={precioRange}
              onChange={setPrecioRange}
              formatValue={formatPrice}
            />
          </div>
          
          {/* Selección múltiple de marcas */}
          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8, 
              color: '#374151',
              fontSize: '14px'
            }}>
              Marcas:
            </label>
            <MultiSelectDropdown
              options={marcasDisponibles}
              selected={marcasSeleccionadas}
              onChange={setMarcasSeleccionadas}
              placeholder="Seleccionar marcas..."
            />
          </div>
          
          {/* Ordenamiento mejorado */}
          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8, 
              color: '#374151',
              fontSize: '14px'
            }}>
              Ordenar por:
            </label>
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
              aria-label="Ordenar productos por"
            >
              <option value="nombre-asc">Nombre A-Z</option>
              <option value="nombre-desc">Nombre Z-A</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="marca-asc">Marca A-Z</option>
              <option value="relevancia">Relevancia</option>
            </select>
          </div>
          
          {/* Botones de acción */}
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            alignItems: 'end',
            gridColumn: 'span 1'
          }}>
            <button
              onClick={limpiarFiltros}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                padding: '12px 20px',
                fontSize: 14,
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.borderColor = '#d1d5db';
              }}
              aria-label="Limpiar todos los filtros"
            >
              <i className="fas fa-times"></i>
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}