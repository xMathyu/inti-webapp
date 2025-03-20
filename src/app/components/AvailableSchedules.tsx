import React, { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AvailableSchedulesProps, Schedule } from "../interfaces/interfaces";
import ScheduleCard from "./admin/ScheduleCard";

const AvailableSchedules: React.FC<AvailableSchedulesProps> = ({
  schedules,
  handleSelectSchedule,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Rome",
  });
  const currentDateObj = new Date(currentDate);

  const filteredSchedules = schedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.date || "");
    return scheduleDate >= currentDateObj;
  });

  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  return (
    <div>
      <h2 className="text-lg font-bold text-green-800 mb-4">
        Orari disponibili
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedSchedules.map((schedule) => (
          <li key={schedule.id} onClick={() => handleSelectSchedule(schedule)}>
            <ScheduleCard schedule={schedule} hideBulkAndActions />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              ></PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              ></PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AvailableSchedules;
