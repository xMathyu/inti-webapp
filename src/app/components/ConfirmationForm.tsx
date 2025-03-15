"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Attendee {
  firstName: string;
  lastName: string;
  cie: string;
  phone: string;
  email: string;
  birthDate: string;
}

interface FormData {
  attendees: Attendee[];
}

const ConfirmationForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scheduleId = searchParams.get("scheduleId");
  const numPeople = parseInt(searchParams.get("numPeople") || "1", 10);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        toast.error("Devi accedere per confermare la prenotazione.");
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const form = useForm<FormData>({
    defaultValues: {
      attendees: Array.from({ length: numPeople }, () => ({
        firstName: "",
        lastName: "",
        cie: "",
        phone: "",
        email: "",
        birthDate: "",
      })),
    },
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    if (!userId || !scheduleId) {
      toast.error(
        "Errore nel recupero dei dati dell'utente o della prenotazione."
      );
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
        attendees: data.attendees,
        createdAt: new Date(),
      });

      await updateDoc(scheduleRef, {
        availableSlots: scheduleData.availableSlots - numPeople,
      });

      toast.success("Prenotazione confermata con successo.");
      router.push("/reservations");
    } catch (error) {
      console.error("Errore nel salvataggio della prenotazione:", error);
      toast.error(
        "Si è verificato un errore nella conferma della prenotazione."
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow">
          <h1 className="text-xl font-bold text-green-800 mb-4">
            Conferma della Prenotazione
          </h1>
          <p className="text-green-700">Inserisci i dati dei partecipanti:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.watch("attendees").map((_, index) => (
              <div key={index} className="border rounded p-4 bg-white my-2">
                <h2 className="font-bold text-green-800">
                  Partecipante {index + 1}
                </h2>
                <FormField
                  control={form.control}
                  name={`attendees.${index}.firstName` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome:</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`attendees.${index}.lastName` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome:</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`attendees.${index}.cie` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CIE:</FormLabel>
                      <FormControl>
                        <Input {...field} required pattern="[A-Z]\d{8}" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`attendees.${index}.phone` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono:</FormLabel>
                      <FormControl>
                        <Input {...field} required pattern="\d{9}" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`attendees.${index}.email` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email:</FormLabel>
                      <FormControl>
                        <Input {...field} required type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`attendees.${index}.birthDate` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data di nascita:</FormLabel>
                      <FormControl>
                        <Input {...field} required type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
          >
            Conferma Prenotazione
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ConfirmationForm;
