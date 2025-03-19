import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
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

interface CardItemProps {
  visit: Visit;
  showButton?: boolean;
}

export default function CardItem({ visit, showButton = true }: CardItemProps) {
  const router = useRouter();

  return (
    <Card className="bg-white shadow-lg border border-gray-200 flex flex-col h-full rounded-lg overflow-hidden">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {visit.name}
        </CardTitle>
        <CardDescription className="text-lg text-gray-500 mt-2">
          {visit.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 flex-1">
        <div className="text-3xl font-bold text-green-800 mb-2">
          €{visit.price}
          <span className="ml-1 text-base font-normal text-gray-400">
            {visit.frequency}
          </span>
        </div>
        <ul className="space-y-2 mt-4">
          {visit.features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start text-gray-600 leading-relaxed"
            >
              <Check className="text-green-500 mr-2 mt-1" size={18} />
              <span className="text-sm md:text-base">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {showButton && (
        <CardFooter className="p-6 pt-0">
          <Button
            className="bg-green-600 hover:bg-green-700 w-full text-white text-lg"
            onClick={() =>
              router.push(`/reservations?type=${encodeURIComponent(visit.id)}`)
            }
          >
            Prenota
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
