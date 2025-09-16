import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useMemo, useState } from "react";
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
import { useFavorites } from "@/hooks/useFavorites";
import {
  BookAIcon,
  EyeIcon,
  FileIcon,
  HeadphonesIcon,
  HeartIcon,
} from "lucide-react";
import {
  // ModelFilters,
  type FilterValues,
  DEFAULT_FILTER_VALUES,
} from "./ModelFilters";

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
  const { favorites } = useFavorites();
  const { setOpen } = useAppSidebarContextV2();
  const [filterValues, setFilterValues] = useState<FilterValues>(
    DEFAULT_FILTER_VALUES
  );

  const selectedModel = useMemo(
    () => models.find((model) => model.id === modelId),
    [modelId, models]
  );

  const isModelSelected = Boolean(selectedModel);

  const filteredModels = useMemo(() => {
    let filtered = models;

    // Filter by loaded status
    if (filterValues.showLoadedOnly) {
      filtered = filtered.filter((model) => model.loaded);
    }

    // Filter by search query
    if (filterValues.searchQuery.trim()) {
      const query = filterValues.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [models, filterValues.showLoadedOnly, filterValues.searchQuery]);

  const favoriteModels = useMemo(() => {
    return models.filter(model => favorites.includes(model.id));
  }, [models, favorites]);

  const groupModels = useMemo(() => {
    return filteredModels.reduce(
      (acc, model) => {
        if (!acc[model.category]) {
          acc[model.category] = [];
        }
        acc[model.category].push(model);
        return acc;
      },
      {} as Record<Category, typeof filteredModels>
    );
  }, [filteredModels]);

  const defaultOpenCategories = useMemo(() => {
    const categories: Category[] = [];
    const hasActiveFilters =
      filterValues.showLoadedOnly || filterValues.searchQuery.trim();

    if (hasActiveFilters) {
      // When filters are active, open all categories that have results
      MODEL_CATEGORIES.forEach((category) => {
        const modelsInCategory = groupModels[category];
        if (modelsInCategory && modelsInCategory.length > 0) {
          categories.push(category);
        }
      });
    } else {
      // When no filters are active, only open the selected model's category
      if (selectedModel?.category) {
        categories.push(selectedModel.category);
      }
    }

    return categories;
  }, [
    selectedModel?.category,
    filterValues.showLoadedOnly,
    filterValues.searchQuery,
    groupModels,
  ]);

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

      <div className="space-y-3">
        <SidebarSearchBar
          onSearch={(query) => {
            setFilterValues((prev) => ({ ...prev, searchQuery: query }));
            onSearch?.(query);
          }}
        />

        <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
          <span className="text-xs text-muted-foreground font-medium">Loaded Only</span>
          <button
            onClick={() =>
              setFilterValues((prev) => ({
                ...prev,
                showLoadedOnly: !prev.showLoadedOnly,
              }))
            }
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              filterValues.showLoadedOnly ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                filterValues.showLoadedOnly ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* <ModelFilters value={filterValues} onChange={setFilterValues} /> */}
      </div>
      <ScrollArea className="flex-1 my-4 -mx-4 px-4 min-h-0 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="favorites" className="w-full">
            <AccordionTrigger className="w-full">
              <SidebarLabel>
                <HeartIcon />
                Favorites ({favoriteModels.length})
              </SidebarLabel>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {favoriteModels.length === 0 ? (
                <EmptySidebarItem message="No favorite models saved" />
              ) : (
                <SidebarList level={1}>
                  {favoriteModels.map((model) => (
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
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          key={`filter-${filterValues.showLoadedOnly}-${filterValues.searchQuery}`}
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
