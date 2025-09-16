import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarLabelProps {
  children: ReactNode;
  className?: string;
  isHighlighted?: boolean;
}

export function SidebarLabel({ children, className, isHighlighted }: SidebarLabelProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "sidebar-label w-full justify-start !text-xs h-[30px] font-medium",
        isHighlighted
          ? "text-foreground bg-accent/50"
          : "text-muted-foreground",
        className
      )}
    >
      {children}
    </Button>
  );
}
