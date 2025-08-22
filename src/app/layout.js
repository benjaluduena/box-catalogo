import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "../components/RootLayoutClient";
import BrowserCompatibilityNotice from "../components/BraveCompatibilityNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Box Neumáticos - Catálogo Completo",
  description: "Encuentra los mejores neumáticos para tu vehículo. Catálogo completo con búsqueda avanzada y filtros inteligentes.",
  keywords: "neumáticos, llantas, autos, camionetas, motos, Córdoba",
  // Mejorar compatibilidad con Brave Browser
  other: {
    'referrer': 'no-referrer-when-downgrade',
  },
  authors: [{ name: "Box Neumáticos" }],
  robots: "index, follow",
  openGraph: {
    title: "Box Neumáticos - Catálogo Completo",
    description: "Encuentra los mejores neumáticos para tu vehículo",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "TireShop",
    "name": "Box Neumáticos",
    "description": "Venta de neumáticos y llantas para autos, camionetas y motos en Villa del Rosario, Córdoba",
    "url": "https://box-neumaticos.vercel.app",
    "telephone": "+54-3573-403958",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sarmiento y RP10",
      "addressLocality": "Villa del Rosario",
      "addressRegion": "Córdoba",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -31.559906,
      "longitude": -63.518331
    },
    "openingHours": [
      "Mo-Fr 08:00-12:00,14:00-18:00",
      "Sa 08:00-12:00"
    ],
    "priceRange": "$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catálogo de Neumáticos",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Neumáticos",
            "category": "Automotive Parts"
          }
        }
      ]
    }
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
        <BrowserCompatibilityNotice />
      </body>
    </html>
  );
}
