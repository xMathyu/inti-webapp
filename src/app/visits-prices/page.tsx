import CardsUser from "@/components/ui/cards-user";

export default function VisitsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
        Tutti i Tipi di Visita
      </h1>
      <CardsUser columns={3} />
    </div>
  );
}
