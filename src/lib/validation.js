export const validateInput = (value, type, options = {}) => {
  if (value === null || value === undefined) {
    return options.required ? 'Este campo es obligatorio' : null;
  }

  const stringValue = String(value).trim();
  
  if (options.required && stringValue === '') {
    return 'Este campo es obligatorio';
  }

  switch (type) {
    case 'text':
      if (options.minLength && stringValue.length < options.minLength) {
        return `Debe tener al menos ${options.minLength} caracteres`;
      }
      if (options.maxLength && stringValue.length > options.maxLength) {
        return `No puede exceder ${options.maxLength} caracteres`;
      }
      if (options.pattern && !options.pattern.test(stringValue)) {
        return options.patternMessage || 'Formato inválido';
      }
      break;

    case 'number':
      const numValue = Number(stringValue);
      if (isNaN(numValue)) {
        return 'Debe ser un número válido';
      }
      if (options.min !== undefined && numValue < options.min) {
        return `Debe ser mayor o igual a ${options.min}`;
      }
      if (options.max !== undefined && numValue > options.max) {
        return `Debe ser menor o igual a ${options.max}`;
      }
      break;

    case 'email':
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(stringValue)) {
        return 'Email inválido';
      }
      break;

    case 'url':
      try {
        new URL(stringValue);
      } catch {
        return 'URL inválida';
      }
      break;

    case 'price':
      const priceValue = Number(stringValue);
      if (isNaN(priceValue) || priceValue < 0) {
        return 'El precio debe ser un número positivo';
      }
      break;
  }

  return null;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationRules)) {
    const error = validateInput(formData[field], rules.type, rules.options);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
};