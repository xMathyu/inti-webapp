import { useState } from "react";
import { Card } from "@/components/ui/card";
import CardContentComponent from "./card-content-component";
import { Visit } from "@/app/interfaces/interfaces";

interface CardItemProps {
  visit: Visit;
  showButton?: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function CardItem({
  visit,
  showButton = true,
  setIsModalOpen,
}: CardItemProps) {
  const [showMore, setShowMore] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowMore(false);
      setIsModalOpen(false);
    }
  };

  const handleShowMore = () => {
    setShowMore(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        className="px-6 bg-white shadow-lg border border-gray-200 flex flex-col h-full rounded-lg max-w-sm w-full mx-auto"
        style={{ cursor: "default", maxWidth: "384px" }}
      >
        <CardContentComponent
          visit={visit}
          showButton={showButton}
          handleShowMore={handleShowMore}
        />
      </Card>

      {showMore && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="bg-a p-6 rounded-lg max-w-3xl"
            style={{ cursor: "default" }}
          >
            <Card className="px-6 bg-white shadow-lg border border-gray-200 flex flex-col h-full rounded-lg">
              <CardContentComponent
                visit={visit}
                showButton={showButton}
                handleClose={() => {
                  setShowMore(false);
                  setIsModalOpen(false);
                }}
              />
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
