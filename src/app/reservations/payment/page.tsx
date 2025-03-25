"use client";

import { Suspense } from "react";
import PaymentPageContent from "./PaymentPageContent";
import CustomLoader from "@/components/CustomLoader";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <CustomLoader />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
