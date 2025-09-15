import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useMemo } from "react";
import { SidebarSearchBar } from "./SidebarSearchBar";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarLabel } from "../SidebarItem/SidebarLabel";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { SidebarList } from "../SidebarItem/SidebarList";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { EmptySidebarItem } from "../SidebarItem/EmptySidebarItem";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ROUTES, type ModelParams } from "@/constants/routes";
import { useModels } from "@/provider/ModelsProvider";
import type { Category } from "@/schema/model";
import { MODEL_CATEGORIES } from "@/constants/model";
import { AppHeaderLogo } from "../AppHeader/AppHeaderLogo";
import { useAppSidebarContextV2 } from "./AppSidebarProviderV2";
import {
  BookAIcon,
  EyeIcon,
  FileIcon,
  HeadphonesIcon,
  PinIcon,
} from "lucide-react";

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

const MODEL_CATEGORIES_ICONS = {
  "Language Processing": BookAIcon,
  Vision: EyeIcon,
  Audio: HeadphonesIcon,
  Multimodal: FileIcon,
  Other: FileIcon,
};

export const AppSidebarV2Content = memo((props: AppSidebarV2ContentProps) => {
  const { className, onSearch, plan, isMobile } = props;
  const { modelId } = useParams({ strict: false }) as ModelParams;
  const navigate = useNavigate();
  const { models } = useModels();
  const { setOpen } = useAppSidebarContextV2();

  const selectedModel = useMemo(
    () => models.find((model) => model.id === modelId),
    [modelId, models]
  );

  const isModelSelected = Boolean(selectedModel);

  const groupModels = useMemo(() => {
    return models.reduce(
      (acc, model) => {
        if (!acc[model.category]) {
          acc[model.category] = [];
        }
        acc[model.category].push(model);
        return acc;
      },
      {} as Record<Category, typeof models>
    );
  }, [models]);

  const defaultOpenCategories = useMemo(() => {
    const categories = [];
    if (selectedModel?.category) {
      categories.push(selectedModel.category);
    }
    return categories;
  }, [selectedModel?.category]);

  const onModelClick = (modelId: string) => {
    navigate({
      to: ROUTES.MODEL(modelId),
    });

    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "p-4 border-r flex flex-col min-h-0",
        {
          "w-[300px]": !isMobile,
          "h-full": isMobile,
        },
        className
      )}
    >
      {isMobile && <AppHeaderLogo />}
      {isMobile && <div className="h-4" />}

      <SidebarSearchBar onSearch={onSearch} />
      <ScrollArea className="flex-1 mt-4 -mx-4 px-4 min-h-0 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="all-models" className="w-full">
            <AccordionTrigger className="w-full [&[data-state=open]_svg]:rotate-90">
              <SidebarLabel>
                <PinIcon />
                Favorite
              </SidebarLabel>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <EmptySidebarItem message="No favorite models saved" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="multiple"
          className="w-full space-y-1"
          defaultValue={defaultOpenCategories}
        >
          {MODEL_CATEGORIES.map((category) => {
            const models = groupModels[category];
            const Icon = MODEL_CATEGORIES_ICONS[category] || FileIcon;
            const isCategoryHighlighted = selectedModel?.category === category;

            if (!models || models.length === 0) {
              return (
                <AccordionItem
                  key={category}
                  value={category}
                  className="w-full"
                >
                  <AccordionTrigger className="w-full">
                    <SidebarLabel isHighlighted={isCategoryHighlighted}>
                      <Icon />
                      {category}
                    </SidebarLabel>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <EmptySidebarItem message="No models in this category" />
                  </AccordionContent>
                </AccordionItem>
              );
            }

            return (
              <AccordionItem key={category} value={category} className="w-full">
                <AccordionTrigger className="w-full">
                  <SidebarLabel isHighlighted={isCategoryHighlighted}>
                    <Icon />
                    {category}
                  </SidebarLabel>
                </AccordionTrigger>
                <AccordionContent>
                  <SidebarList level={1}>
                    {models.map((model) => (
                      <SidebarItem
                        key={model.id}
                        isSelected={
                          isModelSelected && model.id === selectedModel?.id
                        }
                        onClick={() => onModelClick(model.id)}
                      >
                        {model.name}
                      </SidebarItem>
                    ))}
                  </SidebarList>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>

      <SidebarFooter plan={plan} />
    </div>
  );
});
