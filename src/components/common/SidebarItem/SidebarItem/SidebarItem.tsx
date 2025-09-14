import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarItemProps {
  children: ReactNode;
  leftEl?: ReactNode;
  rightEl?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SidebarItem({
  children,
  leftEl,
  rightEl,
  className,
  onClick,
}: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-sm font-medium min-h-[30px] py-0 h-auto min-w-0",
        className
      )}
      onClick={onClick}
    >
      {leftEl && <span className="mr-2">{leftEl}</span>}
      <p className="flex-1 text-left line-clamp-2 overflow-hidden">{children}</p>
      {rightEl && <span className="ml-auto">{rightEl}</span>}
    </Button>
  );
}
