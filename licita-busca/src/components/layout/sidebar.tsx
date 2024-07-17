import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-cerulean",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 text-white",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/" className="flex items-center gap-2">
            {sidebar?.isOpen ? (
              <Image
                src="/Licita_Busca_2_colorido-removebg.png"
                alt="Licita Busca"
                width={150}
                height={50}
                className="mr-1"
              />
            ) : (
              <Image
                src="/Licita_Busca_logo-removebg.png"
                alt="Licita Busca"
                width={50}
                height={50}
                className="mr-1"
              />
            )}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
