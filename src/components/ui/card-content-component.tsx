import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "@mynaui/icons-react";
import { useRouter } from "next/navigation";

interface Visit {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  frequency: string;
  features: string[];
  active: boolean;
}

interface CardContentComponentProps {
  visit: Visit;
  showButton: boolean;
  handleShowMore?: () => void;
  handleClose?: () => void;
}

export default function CardContentComponent({
  visit,
  showButton,
  handleShowMore,
  handleClose,
}: CardContentComponentProps) {
  const router = useRouter();

  return (
    <>
      <CardHeader className="pb-3 text-left">
        <CardTitle className="text-2xl font-semibold text-gray-900 min-h-[60px] lg:min-h-[90px] flex items-center">
          {visit.name}
        </CardTitle>

        <CardDescription className="text-base text-gray-500 min-h-[50px] flex items-center">
          {visit.shortDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-start gap-y-4">
        <div className="text-4xl font-bold text-green-800">
          €{visit.price}
          <span className="ml-1 text-base font-medium text-gray-500">
            {visit.frequency}
          </span>
        </div>

        {showButton && (
          <Button
            className="bg-green-600 hover:bg-green-700 w-full text-white text-lg py-2 rounded-md max-w-xs"
            onClick={() =>
              router.push(`/reservations?type=${encodeURIComponent(visit.id)}`)
            }
          >
            Prenota ora
          </Button>
        )}

        <ul className="space-y-2 mt-4 w-full max-h-42 overflow-hidden">
          {visit.features.slice(0, 3).map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center text-gray-500"
              style={{ cursor: "default" }}
            >
              <Check className="text-green-500 mr-2" size={18} />
              <span className="text-sm md:text-base">{feature}</span>
            </li>
          ))}
          {visit.features.length > 3 && handleShowMore && (
            <li
              className="flex items-center text-gray-500 cursor-pointer"
              onClick={handleShowMore}
            >
              <span className="text-sm pl-6 md:text-base text-blue-500">
                Vedi di più
              </span>
            </li>
          )}
        </ul>

        {handleClose && (
          <span
            className="text-sm pl-6 md:text-base text-blue-500"
            onClick={handleClose}
          >
            Chiudi
          </span>
        )}
      </CardContent>
    </>
  );
}
