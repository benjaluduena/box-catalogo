import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Crear cliente base
const baseClient = createClient(supabaseUrl, supabaseAnonKey);

// Crear wrapper que intercepte y corrija consultas problemáticas
export const supabase = {
  ...baseClient,
  from: (table) => {
    const query = baseClient.from(table);
    
    // Si es tabla neumaticos, interceptar el método select
    if (table === 'neumaticos') {
      const originalSelect = query.select.bind(query);
      
      query.select = function(columns, options) {
        // Si la consulta incluye medidas con stock, corregirla
        if (typeof columns === 'string' && columns.includes('medidas(id,medida,stock)')) {
          console.warn('🔧 Supabase: Corrigiendo consulta - removiendo campo stock inexistente');
          columns = columns.replace('medidas(id,medida,stock)', 'medidas(id,medida)');
        }
        return originalSelect(columns, options);
      };
    }
    
    return query;
  }
};