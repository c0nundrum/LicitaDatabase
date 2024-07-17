"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DrawerContent as DrawerContentComponent } from "./drawer-content";
import { SheetContent as SheetContentComponent } from "./sheet-content";

export function AdvancedFilter({
  onApplyFilters,
}: {
  onApplyFilters: (filters: { states: string[] }) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Card className="flex flex-col items-center justify-center gap-2 p-2 flex-1 min-w-[150px] cursor-pointer select-none shadow-md">
            <CardHeader className="flex flex-col items-center gap-2">
              <Filter />
              <CardTitle>Filtro Avançado</CardTitle>
            </CardHeader>
          </Card>
        </SheetTrigger>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Filtro Avançado</SheetTitle>
          </SheetHeader>
          <SheetContentComponent onApplyFilters={onApplyFilters} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Card className="flex flex-col items-center justify-center gap-2 p-2 flex-1 min-w-[150px] cursor-pointer shadow-md">
          <CardHeader className="flex flex-col items-center gap-2">
            <Filter />
            <CardTitle>Filtro Avançado</CardTitle>
          </CardHeader>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>Filtro Avançado</DrawerTitle>
        </DrawerHeader>
        <DrawerContentComponent onApplyFilters={onApplyFilters} />
      </DrawerContent>
    </Drawer>
  );
}
