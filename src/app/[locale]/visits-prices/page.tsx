import GrillaCard from "@/components/ui/grilla-card";
export default function VisitsPage() {
  return (
    <div className="container mx-auto py-10">
      {/* 🔹 Separate title */}
      <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
        Tutti i Tipi di Visita
      </h1>

      {/* 🔹 The card grid */}
      <GrillaCard />
    </div>
  );
}
