import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Lightbulb } from "lucide-react";
import { ExamplePromptsList } from "../ExamplePromptsList";
import { type TaskWithExamples } from "@/constants/model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";

interface ExamplePromptsPopoverProps {
  currentTask?: TaskWithExamples;
}

export const ExamplePromptsPopover = ({ currentTask }: ExamplePromptsPopoverProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  if (!isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Examples
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 max-w-md" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Example Prompts</h4>
            <p className="text-xs text-muted-foreground">
              Click on any example to copy it to your clipboard
            </p>
            <ExamplePromptsList currentTask={currentTask} />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Lightbulb className="h-4 w-4" />
          Examples
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 space-y-2">
          <h4 className="font-medium text-sm">Example Prompts</h4>
          <p className="text-xs text-muted-foreground">
            Click on any example to copy it to your clipboard
          </p>
          <ExamplePromptsList currentTask={currentTask} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
