"use client";

import { useState } from "react";
import { Gavel, Newspaper } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedFilter } from "./advanced-filter/advanced-filter-button";

export function Filters({
  onFilterChange,
  onApplyFilters,
}: {
  onFilterChange: (filter: string | null) => void;
  onApplyFilters: (filters: { states: string[] }) => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleCardClick = (filter: string) => {
    const newFilter = selectedFilter === filter ? null : filter;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-12">
      <Card
        className={`flex flex-col items-center justify-center gap-2 p-2 flex-1 min-w-[150px] cursor-pointer shadow-md ${
          selectedFilter === "pregao"
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        onClick={() => handleCardClick("pregao")}
      >
        <CardHeader className="flex flex-col items-center gap-2">
          <Gavel />
          <CardTitle>Pregão Eletrônico</CardTitle>
        </CardHeader>
      </Card>
      <Card
        className={`flex flex-col items-center justify-center gap-2 p-2 flex-1 min-w-[150px] cursor-pointer shadow-md ${
          selectedFilter === "dispensa"
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        onClick={() => handleCardClick("dispensa")}
      >
        <CardHeader className="flex flex-col items-center gap-2">
          <Newspaper />
          <CardTitle>Dispensa Eletrônica</CardTitle>
        </CardHeader>
      </Card>
      <AdvancedFilter onApplyFilters={onApplyFilters} />
    </div>
  );
}
