export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://box-neumaticos.vercel.app/sitemap.xml', // Cambia por tu dominio real
  };
}