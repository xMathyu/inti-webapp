'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/app/lib/firebase";

interface Attendee {
  firstName: string;
  lastName: string;
  cie: string;
  phone: string;
}

interface ReservationWizardProps {
  scheduleId: string;
  numPeople: number;
}

const ReservationWizard: React.FC<ReservationWizardProps> = ({ scheduleId, numPeople }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>(
    Array.from({ length: numPeople }, () => ({
      firstName: "",
      lastName: "",
      cie: "",
      phone: "",
    }))
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        toast.error("Per confermare la prenotazione è necessario aver effettuato il login.");
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (field: keyof Attendee, value: string) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[currentStep] = { ...updatedAttendees[currentStep], [field]: value };
    setAttendees(updatedAttendees);
  };

  const handleNext = () => {
    if (Object.values(attendees[currentStep]).some((val) => val.trim() === "")) {
      toast.error("Si prega di compilare tutti i campi.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!userId || !scheduleId) {
      toast.error("Errore nell'ottenere i dati dell'utente o della prenotazione.");
      return;
    }
    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);

      if (!scheduleSnap.exists()) {
        toast.error("L'orario selezionato non esiste.");
        return;
      }
      const scheduleData = scheduleSnap.data();
      if (scheduleData.availableSlots < numPeople) {
        toast.error("Non ci sono abbastanza posti disponibili.");
        return;
      }
      await addDoc(collection(db, "reservations"), {
        userId,
        scheduleId,
        attendees,
        createdAt: new Date(),
      });
      await updateDoc(scheduleRef, {
        availableSlots: scheduleData.availableSlots - numPeople,
      });
      toast.success("Prenotazione confermata con successo.");
      router.push("/reservations");
    } catch (error) {
      console.error("Error saving the reservation:", error);
      toast.error("C'è stato un errore durante la conferma della prenotazione.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-green-50 rounded shadow">
      <h1 className="text-xl font-bold text-green-800 mb-4">Conferma della prenotazione</h1>
      <p className="text-green-700">Inserire i dati della procedura guidata {currentStep + 1}:</p>
      <div className="border rounded p-4 bg-white my-2">
        <Label>Nome:</Label>
        <Input type="text" value={attendees[currentStep].firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
        <Label>Cognome:</Label>
        <Input type="text" value={attendees[currentStep].lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
        <Label>CIE:</Label>
        <Input type="text" value={attendees[currentStep].cie} onChange={(e) => handleChange("cie", e.target.value)} required />
        <Label>Telefono:</Label>
        <Input type="tel" value={attendees[currentStep].phone} onChange={(e) => handleChange("phone", e.target.value)} required />
      </div>
      <div className="flex justify-between mt-4">
        {currentStep > 0 && <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700">Indietro</Button>}
        {currentStep < numPeople - 1 ? (
          <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">Avanti</Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Confermare la prenotazione</Button>
        )}
      </div>
    </div>
  );
};

export default ReservationWizard;