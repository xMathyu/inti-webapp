"use client";

import React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface Attendee {
  firstName: string;
  lastName: string;
  documentType: "CIE" | "Passaporto";
  documentNumber: string;
  phone: string;
  email: string;
  birthDate: string;
}

export interface FormData {
  attendees: Attendee[];
}

interface ConfirmationFormProps {
  numPeople: number;
  onSubmit: SubmitHandler<FormData>;
}

const ConfirmationForm = ({ numPeople, onSubmit }: ConfirmationFormProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      attendees: Array.from({ length: numPeople }, () => ({
        firstName: "",
        lastName: "",
        documentType: "CIE",
        documentNumber: "",
        phone: "",
        email: "",
        birthDate: "",
      })),
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-w-4xl mx-auto p-6 bg-green-50 rounded-xl shadow-lg">
          <h1 className="text-2xl font-extrabold text-green-800 mb-2 text-center">
            Conferma della Prenotazione
          </h1>
          <p className="text-green-700 text-center mb-6">
            Inserisci i dati dei partecipanti
          </p>

          <div className="space-y-6">
            {form.watch("attendees").map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 border border-gray-200 transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  Partecipante {index + 1}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} required placeholder="Es. Mario" />
                        </FormControl>
                        <FormDescription>
                          Inserisci il nome del partecipante.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cognome</FormLabel>
                        <FormControl>
                          <Input {...field} required placeholder="Es. Rossi" />
                        </FormControl>
                        <FormDescription>
                          Inserisci il cognome del partecipante.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.documentType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo di Documento</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleziona..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CIE">CIE</SelectItem>
                              <SelectItem value="Passaporto">
                                Passaporto
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.documentNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numero del Documento</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder={
                              form.watch(`attendees.${index}.documentType`) ===
                              "CIE"
                                ? "Es. A12345678"
                                : "Es. 123456789"
                            }
                            pattern={
                              form.watch(`attendees.${index}.documentType`) ===
                              "CIE"
                                ? "[A-Z]\\d{8}"
                                : undefined
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {form.watch(`attendees.${index}.documentType`) ===
                          "CIE"
                            ? "Formato: Una lettera maiuscola seguita da 8 cifre."
                            : "Inserisci il numero del passaporto."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder="Es. +39 0123456789"
                          />
                        </FormControl>
                        <FormDescription>
                          Inserisci il tuo numero di telefono, incluso il
                          prefisso internazionale.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.email`}
                    rules={{
                      required: "El correo electrónico es obligatorio.",
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Ingresa un correo electrónico válido.",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="esempio@mail.com"
                          />
                        </FormControl>
                        <FormDescription>
                          Inserisci un indirizzo email valido.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.birthDate`}
                    render={({ field }) => {
                      const selectedDate = field.value
                        ? new Date(field.value)
                        : undefined;
                      return (
                        <FormItem>
                          <FormLabel>Data di Nascita</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-white border",
                                    !selectedDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? (
                                    format(selectedDate, "PPP", { locale: it })
                                  ) : (
                                    <span>Seleziona una data</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => {
                                    field.onChange(
                                      date ? format(date, "yyyy-MM-dd") : ""
                                    );
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormDescription>
                            Seleziona la data di nascita.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center mt-8">
            <Button
              type="submit"
              className="w-auto bg-green-600 hover:bg-green-700 text-white py-3 transition-colors"
            >
              Conferma Prenotazione
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ConfirmationForm;
