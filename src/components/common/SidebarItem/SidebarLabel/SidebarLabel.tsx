import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface SidebarLabelProps {
  children: ReactNode;
  className?: string;
}

export function SidebarLabel({ children, className }: SidebarLabelProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "sidebar-label w-full justify-start !text-sm h-[30px] text-muted-foreground font-normal",
        className
      )}
    >
      <ChevronRight />
      {children}
    </Button>
  );
}
