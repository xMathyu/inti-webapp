"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import GrillaCard from "@/components/ui/grilla-card";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "@/app/[locale]/lib/firebase";
import { toast } from "sonner";
import { VisitOrder } from "@/app/[locale]/interfaces/interfaces";
import { useTranslations } from "next-intl";

export default function AdminVisitsPricePage() {
  const t = useTranslations("Admin/VisitTypePrices");

  const [visits, setVisits] = useState<VisitOrder[]>([]);

  const handleSaveOrder = async (visits: VisitOrder[]) => {
    try {
      const batch = writeBatch(db);
      visits.forEach((visit, index) => {
        const visitRef = doc(collection(db, "visitTypes"), visit.id);
        batch.update(visitRef, { order: (index + 1).toString() });
      });
      await batch.commit();
      toast.success(t("ToastMessages.SaveSuccess"));
    } catch (error) {
      console.error("Errore durante il salvataggio del nuovo ordine:", error);
      toast.error(t("ToastMessages.SaveError"));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-4 md:mb-0">
          {t("Title")}
        </h1>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleSaveOrder(visits)}
        >
          {t("Button")}
        </Button>
      </div>

      <GrillaCard
        showButton={false}
        isAdmin={true}
        onVisitsChange={setVisits}
      />
    </div>
  );
}
