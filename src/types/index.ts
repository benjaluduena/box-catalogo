// Tipos para el catálogo de neumáticos
export interface Neumatico {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_anterior?: number;
  imagen?: string;
  tipo_id: number;
  marca_id: number;
  marcas?: Marca;
  tipos_vehiculo?: TipoVehiculo;
}

export interface Marca {
  id: number;
  nombre: string;
  logo?: string;
}

export interface TipoVehiculo {
  id: number;
  nombre: string;
}

// Tipos para autenticación
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// Tipos para componentes
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Tipos para formularios
export interface FormData {
  [key: string]: string | number | boolean;
}

// Tipos para navegación
export interface NavItem {
  href: string;
  label: string;
  scroll?: boolean;
}

// Tipos para servicios
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  whatsappMessage: string;
} 