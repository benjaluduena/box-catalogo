import CatalogoNeumaticos from "../../components/CatalogoNeumaticos";

export default function CatalogoPage() {
  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>
        Catálogo de Neumáticos
      </h1>
      <CatalogoNeumaticos />
    </main>
  );
} 