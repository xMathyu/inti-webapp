"use client";

import ConfirmationForm from "@/app/components/ConfirmationForm";
import { Suspense } from "react";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}

function ConfirmContent() {
  return <ConfirmationForm />;
}
