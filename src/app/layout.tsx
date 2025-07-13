import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "../components/RootLayoutClient.jsx";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BOX Neumáticos - Expertos en Neumáticos y Servicios Automotrices",
  description: "Ofrecemos la mejor selección de neumáticos y servicios de calidad para mantener tu vehículo en óptimas condiciones.",
  keywords: "neumáticos, gomería, servicios automotrices, venta de neumáticos",
  authors: [{ name: "BOX Neumáticos" }],
  openGraph: {
    title: "BOX Neumáticos - Expertos en Neumáticos",
    description: "La mejor selección de neumáticos y servicios automotrices",
    type: "website",
    locale: "es_AR",
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
} 