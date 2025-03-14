import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
import { Input } from "@/components/ui/input";

interface FormsReservationProps {
  visitType: string;
  setVisitType: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  numPeople: number;
  setNumPeople: (value: number) => void;
  visitTypesOptions: { id: string; name: string }[];
  loading: boolean;
  handleSearch: SubmitHandler<FormData>;
  visitId?: string;
}

interface FormData {
  visitType: string;
  date: string;
  numPeople: number;
}

const FormsReservation: React.FC<FormsReservationProps> = ({
  visitType,
  setVisitType,
  date,
  setDate,
  numPeople,
  setNumPeople,
  visitTypesOptions,
  loading,
  handleSearch,
  visitId,
}) => {
  const form = useForm<FormData>();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? new Date(date) : undefined
  );
  console.log(visitId);
  React.useEffect(() => {
    if (visitId) {
      setVisitType(visitId);
    }
  }, [visitId, setVisitType]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="flex flex-wrap gap-4"
      >
        <FormField
          control={form.control}
          name="visitType"
          render={() => (
            <FormItem className="flex-1 min-w-[200px]">
              <FormLabel>Visita Tipo</FormLabel>
              <FormControl>
                <Select
                  value={visitType}
                  onValueChange={(value) => setVisitType(value)}
                >
                  <SelectTrigger className="w-full bg-white border">
                    <SelectValue placeholder="Seleziona una tipologia di visita">
                      {visitType || "Seleziona una tipologia di visita"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {visitTypesOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Seleziona il tipo di visita che desideri effettuare.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={() => (
            <FormItem className="flex-1 min-w-[200px]">
              <FormLabel>Data</FormLabel>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setDate(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                Seleziona la data della tua visita.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numPeople"
          render={({ field }) => (
            <FormItem className="flex-1 min-w-[200px]">
              <FormLabel>Numero di persone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={numPeople}
                  min="1"
                  onChange={(e) => setNumPeople(parseInt(e.target.value))}
                  required
                  className="bg-white border"
                />
              </FormControl>
              <FormDescription>
                Indicare il numero di persone che parteciperanno.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-center mt-4">
          <Button
            type="submit"
            className="w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Ricerca..." : "Cerca orari"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormsReservation;
