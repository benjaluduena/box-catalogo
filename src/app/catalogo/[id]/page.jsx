import { supabase } from "../../../lib/supabaseClient";
import NeumaticoDetalleClient from "./NeumaticoDetalleClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const { data: neumatico } = await supabase
      .from("neumaticos")
      .select("*")
      .eq("id", id)
      .single();
      
    let marca = null;
    if (neumatico && neumatico.marca_id) {
      const { data: marcaData } = await supabase
        .from("marcas")
        .select("nombre")
        .eq("id", neumatico.marca_id)
        .single();
      marca = marcaData;
    }

    if (neumatico) {
      return {
        title: `${neumatico.nombre} - ${marca?.nombre || 'Marca'} | Box Neumáticos`,
        description: `${neumatico.descripcion || `Neumático ${neumatico.nombre} de ${marca?.nombre || 'marca'}`}. Disponible en Box Neumáticos, Villa del Rosario, Córdoba.`,
        keywords: `${neumatico.nombre}, ${marca?.nombre || ''}, neumáticos Córdoba, Box Neumáticos`,
        openGraph: {
          title: `${neumatico.nombre} - ${marca?.nombre || 'Marca'}`,
          description: neumatico.descripcion || `Neumático ${neumatico.nombre} disponible en Box Neumáticos`,
          type: "website",
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