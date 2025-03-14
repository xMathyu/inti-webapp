"use client";

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
  email: string;
  birthDate: string;
}

interface ReservationWizardProps {
  scheduleId: string;
  numPeople: number;
}

const ReservationWizard: React.FC<ReservationWizardProps> = ({ scheduleId, numPeople }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>(
    Array.from({ length: numPeople }, () => ({
      firstName: "",
      lastName: "",
      cie: "",
      phone: "",
      email: "",
      birthDate: "",
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

  const isValidCIE = (cie: string) => /^[a-zA-Z0-9]{8,10}$/.test(cie);
  const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(phone);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isAdult = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 18;
  };

  const handleNext = () => {
    const { firstName, lastName, cie, phone, email, birthDate } = attendees[currentStep];

    if (!firstName.trim() || !lastName.trim() || !cie.trim() || !phone.trim() || !email.trim() || !birthDate.trim()) {
      toast.error("Si prega di compilare tutti i campi correttamente.");
      return;
    }

    if (!isValidCIE(cie)) {
      toast.error("Il CIE deve contenere tra 8 e 10 caratteri alfanumerici.");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Il numero di telefono deve contenere tra 8 e 15 cifre.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Inserisci un'email valida.");
      return;
    }

    if (!isAdult(birthDate)) {
      toast.error("Devi essere maggiorenne per effettuare la prenotazione.");
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

    const allAttendeesFilled = attendees.every(
      (attendee) =>
        attendee.firstName.trim() &&
        attendee.lastName.trim() &&
        isValidCIE(attendee.cie) &&
        isValidPhone(attendee.phone) &&
        isValidEmail(attendee.email) &&
        isAdult(attendee.birthDate)
    );

    if (!allAttendeesFilled) {
      toast.error("È necessario completare correttamente le informazioni di tutti i partecipanti.");
      return;
    }

    setLoading(true);

    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);

      if (!scheduleSnap.exists()) {
        toast.error("L'orario selezionato non esiste.");
        setLoading(false);
        return;
      }

      const scheduleData = scheduleSnap.data();
      if (scheduleData.availableSlots < attendees.length) {
        toast.error("Non ci sono abbastanza posti disponibili.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "reservations"), {
        userId,
        scheduleId,
        attendees,
        createdAt: new Date(),
      });

      await updateDoc(scheduleRef, {
        availableSlots: scheduleData.availableSlots - attendees.length,
      });

      toast.success("Prenotazione confermata con successo.");
      router.push("/reservations");
    } catch (error) {
      console.error("Error saving the reservation:", error);
      toast.error("C'è stato un errore durante la conferma della prenotazione.");
    }

    setLoading(false);
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
        <Label>Email:</Label>
        <Input type="email" value={attendees[currentStep].email} onChange={(e) => handleChange("email", e.target.value)} required />
        <Label>Data di nascita:</Label>
        <Input type="date" value={attendees[currentStep].birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} required />
      </div>
      <div className="flex justify-between mt-4">
        {currentStep > 0 && <Button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700">Indietro</Button>}
        {currentStep < numPeople - 1 ? (
          <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">Avanti</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Caricamento..." : "Confermare la prenotazione"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReservationWizard;