import { supabase } from '../lib/supabaseClient';

export default async function sitemap() {
  const baseUrl = 'https://box-neumaticos.vercel.app'; // Cambia por tu dominio real

  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // URLs dinámicas de productos
  let productUrls = [];
  try {
    const { data: neumaticos } = await supabase
      .from('neumaticos')
      .select('id, updated_at');

    if (neumaticos) {
      productUrls = neumaticos.map(neumatico => ({
        url: `${baseUrl}/catalogo/${neumatico.id}`,
        lastModified: new Date(neumatico.updated_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generando sitemap:', error);
  }

  return [...staticUrls, ...productUrls];
}