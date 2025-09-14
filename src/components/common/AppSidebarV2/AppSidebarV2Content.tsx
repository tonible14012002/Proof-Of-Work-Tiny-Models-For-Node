import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { memo } from "react";
import { SidebarSearchBar } from "./SidebarSearchBar";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarLabel } from "../SidebarItem/SidebarLabel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { SidebarList } from "../SidebarItem/SidebarList";
import { SidebarItem } from "../SidebarItem/SidebarItem";

interface AppSidebarV2ContentProps {
  className?: string;
  onSearch?: (query: string) => void;
  isMobile?: boolean;
  plan?: {
    name: string;
    type: "free" | "pro" | "enterprise";
    usage?: {
      current: number;
      limit: number;
      unit: string;
    };
  };
}

export const AppSidebarV2Content = memo((props: AppSidebarV2ContentProps) => {
  const { className, onSearch, plan, isMobile } = props;
  return (
    <div
      className={cn("p-4 border-r flex flex-col min-h-0", {
        "w-[270px]": !isMobile,
        "h-full": isMobile,
      }, className)}
    >
      <SidebarSearchBar onSearch={onSearch} />

      <ScrollArea className="flex-1 mt-4 -mx-4 px-4 min-h-0">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="natural-language" className="w-full">
            <AccordionTrigger className="w-full [&[data-state=open]_svg]:rotate-90">
              <SidebarLabel>Natural Language</SidebarLabel>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <SidebarList level={1}>
                <SidebarItem>Payment Intent Text Detection</SidebarItem>
                <SidebarItem>Text2Text Generation</SidebarItem>
              </SidebarList>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <SidebarLabel>Speech</SidebarLabel>
        <SidebarLabel>Vision</SidebarLabel>
      </ScrollArea>

      <SidebarFooter plan={plan} />
    </div>
  );
});
