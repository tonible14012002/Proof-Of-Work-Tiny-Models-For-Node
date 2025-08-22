import { ModelGroup } from "@/components/Model/ModelGroup";
import { ModelInferenceView } from "@/components/Model/ModelInferenceView";
import { ModelList } from "@/components/Model/ModelList";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/ui/layout";
import type { ModelDetail } from "@/schema/model";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModels } from "@/provider/ModelsProvider";

export const HomePage = () => {
  const { models } = useModels();
  const [selectedModel, setSelectedModel] = useState<ModelDetail>();

  return (
    <Layout container={false} wrapperClassName="h-full">
      <div className="grid grid-cols-[340px_1fr] h-full">
        <div className="p-4 border-r flex flex-col min-h-0">
          <h3 className="font-bold text-xl tracking-tight">Proof of Concept</h3>
          <p className="text-xs text-muted-foreground">Training Tiny Models</p>
          <div className="mt-8">
            <Button size="sm">
              <Plus />
              Add Custom Model
            </Button>
          </div>
          <ScrollArea className="flex-1 mt-8 -mx-4 px-4 min-h-0">
            <ModelGroup
              title="Transformer.Js"
              listEl={
                <ModelList
                  modelDetails={models}
                  onSelectModel={setSelectedModel}
                />
              }
            />
          </ScrollArea>
        </div>
        <div className="h-full min-h-0">
          {selectedModel && (
            // Force reload component on change
            <ModelInferenceView
              selectedModel={selectedModel}
              key={selectedModel.id}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};
