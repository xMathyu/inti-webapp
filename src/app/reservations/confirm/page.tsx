"use client";

import ReservationWizard from "@/app/components/ReservationWizard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmContent/>
    </Suspense>
  );
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId") || "";
  const numPeople = parseInt(searchParams.get("numPeople") || "1", 10);

  return <ReservationWizard scheduleId={scheduleId} numPeople={numPeople} />;
}