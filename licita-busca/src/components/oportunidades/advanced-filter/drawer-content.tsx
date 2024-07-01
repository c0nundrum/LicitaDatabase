"use client";

import { DatePickerWithRange } from "./date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FilterSection } from "./filter-section";
import { states } from "@/data/states";
import { portals } from "@/data/portals";
import { organs } from "@/data/organs";
import { useState } from "react";

export function DrawerContent({
  onApplyFilters,
}: {
  onApplyFilters: (filters: { states: string[] }) => void;
}) {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleStateChange = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const clearStates = () => setSelectedStates([]);

  const handleApplyFilters = () => {
    onApplyFilters({ states: selectedStates });
  };

  return (
    <>
      <FilterSection title="Período">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="abertura">Data de abertura</SelectItem>
            <SelectItem value="publicacao">Data de publicação</SelectItem>
          </SelectContent>
        </Select>
        <DatePickerWithRange className="w-full" />
      </FilterSection>
      <Separator />
      <FilterSection title="Estados">
        <div className="grid grid-cols-3 gap-2 justify-center">
          {states.map((state) => (
            <div key={state} className="flex items-center gap-2">
              <Checkbox
                checked={selectedStates.includes(state)}
                onCheckedChange={() => handleStateChange(state)}
              />
              <Label>{state}</Label>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-center">
          <Button variant="outline" onClick={clearStates}>
            Limpar
          </Button>
        </div>
      </FilterSection>
      <Separator />
      <FilterSection title="Portais">
        <div className="grid grid-cols-2 gap-4 justify-center">
          {portals.map((portal) => (
            <div key={portal} className="flex items-center gap-2">
              <Checkbox />
              <Label>{portal}</Label>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-center">
          <Button variant="outline" onClick={clearStates}>
            Limpar
          </Button>
        </div>
      </FilterSection>
      <Separator />
      <FilterSection title="Órgão">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o órgão" />
          </SelectTrigger>
          <SelectContent>
            {organs.map((organ) => (
              <SelectItem key={organ} value={organ}>
                {organ}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>
      <div className="py-4 flex justify-center">
        <Button variant="outline" onClick={handleApplyFilters}>
          Aplicar Filtros
        </Button>
      </div>
    </>
  );
}
