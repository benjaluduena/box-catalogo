import { supabase } from "../../../lib/supabaseClient";
import NeumaticoDetalleClient from "./NeumaticoDetalleClient";

export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const { data: neumatico } = await supabase
      .from("neumaticos")
      .select(`*, marcas(nombre)`)
      .eq("id", id)
      .single();

    if (neumatico) {
      return {
        title: `${neumatico.nombre} - ${neumatico.marcas?.nombre} | Box Neumáticos`,
        description: `${neumatico.descripcion || `Neumático ${neumatico.nombre} de ${neumatico.marcas?.nombre}`}. Disponible en Box Neumáticos, Villa del Rosario, Córdoba.`,
        keywords: `${neumatico.nombre}, ${neumatico.marcas?.nombre}, neumáticos Córdoba, Box Neumáticos`,
        openGraph: {
          title: `${neumatico.nombre} - ${neumatico.marcas?.nombre}`,
          description: neumatico.descripcion || `Neumático ${neumatico.nombre} disponible en Box Neumáticos`,
          type: "product",
          locale: "es_AR",
          images: neumatico.imagen ? [neumatico.imagen] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error generando metadata:", error);
  }

  return {
    title: "Neumático - Box Neumáticos",
    description: "Información detallada del neumático en Box Neumáticos, Villa del Rosario, Córdoba.",
  };
}

export default function NeumaticoDetallePage() {
  return <NeumaticoDetalleClient />;
} 