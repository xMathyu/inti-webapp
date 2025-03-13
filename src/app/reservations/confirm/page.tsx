import ReservationWizard from "@/app/components/ReservationWizard";

export default function ConfirmPage({ searchParams }: { searchParams: { scheduleId: string; numPeople: string } }) {
  return <ReservationWizard scheduleId={searchParams.scheduleId} numPeople={parseInt(searchParams.numPeople, 10)} />;
}