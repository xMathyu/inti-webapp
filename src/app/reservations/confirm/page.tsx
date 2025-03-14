"use client";

import ReservationWizard from "@/app/components/ReservationWizard";
import { useSearchParams } from "next/navigation";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId") || "";
  const numPeople = parseInt(searchParams.get("numPeople") || "1", 10);

  return <ReservationWizard scheduleId={scheduleId} numPeople={numPeople} />;
}
