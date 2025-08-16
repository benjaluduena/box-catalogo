"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

export function SearchWithSuggestions({
  value,
  onChange,
  onSelect,
  suggestions = [],
  placeholder = "Buscar neumáticos...",
  maxSuggestions = 5,
  debounceMs = 300,
  minChars = 2
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef();
  const suggestionsRef = useRef();
  const debounceRef = useRef();

  // Filtrar sugerencias basadas en el valor de búsqueda
  const filterSuggestions = useCallback((searchValue) => {
    if (!searchValue || searchValue.length < minChars) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, maxSuggestions);
    
    setFilteredSuggestions(filtered);
  }, [suggestions, maxSuggestions, minChars]);

  // Debounce para las sugerencias
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      filterSuggestions(value);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, filterSuggestions, debounceMs]);

  // Manejar teclas del teclado
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    onChange(suggestion);
    onSelect?.(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            backgroundColor: '#fff',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#0ea5e9';
            e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
          aria-label="Buscar neumáticos"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        {/* Icono de búsqueda */}
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b',
          pointerEvents: 'none'
        }}>
          <i className="fas fa-search" style={{ fontSize: '16px' }}></i>
        </div>

        {/* Botón limpiar */}
        {value && (
          <button
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.target.style.color = '#64748b'}
            onMouseOut={(e) => e.target.style.color = '#94a3b8'}
            aria-label="Limpiar búsqueda"
          >
            <i className="fas fa-times" style={{ fontSize: '14px' }}></i>
          </button>
        )}
      </div>

      {/* Lista de sugerencias */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          role="listbox"
          aria-label="Sugerencias de búsqueda"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            marginTop: '4px'
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => selectSuggestion(suggestion)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: index === highlightedIndex ? '#f0f9ff' : 'transparent',
                color: index === highlightedIndex ? '#0ea5e9' : '#374151',
                borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <i className="fas fa-search" style={{ 
                fontSize: '12px', 
                color: '#94a3b8',
                width: '12px' 
              }}></i>
              <span style={{ fontSize: '14px' }}>
                {suggestion}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}