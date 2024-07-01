"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export function FilterSection({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <div className="grid gap-4 py-4">
      <div className="flex justify-between items-center">
        <Label className="text-left">{title}</Label>
        <Button variant="outline" size="icon" onClick={() => setOpen(!open)}>
          {open ? <Minus /> : <Plus />}
        </Button>
      </div>
      {open && children}
    </div>
  );
}
