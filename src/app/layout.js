import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "../components/RootLayoutClient";

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
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
