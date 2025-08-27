import { ModelInferenceView } from "@/components/Model/ModelInferenceView";

import { Layout } from "@/components/ui/layout";
import type { ModelDetail } from "@/schema/model";
import { useEffect, useState } from "react";
import { useModels } from "@/provider/ModelsProvider";
import { AppSidebar } from "@/components/common/AppSidebar";
import { EmptyState } from "@/components/common/EmptyState";

export const HomePage = () => {
  const { models } = useModels();
  const [selectedModel, setSelectedModel] = useState<ModelDetail>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!selectedModel) {
      setIsOpen(true);
    }
  }, [models, selectedModel]);

  return (
    <Layout container={false} wrapperClassName="h-full">
      <div className="grid md:grid-cols-[340px_1fr] h-full grid-cols-[52px_1fr] transition-all">
        <AppSidebar
          models={models}
          onSelectModel={setSelectedModel}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
        <div className="h-full min-h-0 min-w-0">
          {selectedModel ? (
            // Force reload component on change
            <ModelInferenceView
              selectedModel={selectedModel}
              key={selectedModel.id}
            />
          ) : (
            <EmptyState onOpenSidebar={() => setIsOpen(true)} />
          )}
        </div>
      </div>
    </Layout>
  );
};
