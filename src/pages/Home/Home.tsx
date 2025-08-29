import { ModelInferenceView } from "@/components/Model/ModelInferenceView";

import { Layout } from "@/components/ui/layout";
import { memo, useEffect, useState } from "react";
import { useModels } from "@/provider/ModelsProvider";
import { AppSidebar } from "@/components/common/AppSidebar";
import { EmptyState } from "@/components/common/EmptyState";

export const HomePage = memo(() => {
  const { models } = useModels();
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!selectedModelId) {
      setIsOpen(true);
    }
  }, [models, selectedModelId]);

  return (
    <Layout container={false} wrapperClassName="h-full overflow-hidden">
      <div className="grid md:grid-cols-[340px_1fr] h-full grid-cols-[52px_1fr] transition-all">
        <AppSidebar
          selectedModelId={selectedModelId}
          models={models}
          onSelectModel={(model) => setSelectedModelId(model.id)}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
        <div className="h-full min-h-0 min-w-0">
          {selectedModelId ? (
            // Force reload component on change
            <ModelInferenceView
              selectedModelId={selectedModelId}
              key={selectedModelId}
            />
          ) : (
            <EmptyState onOpenSidebar={() => setIsOpen(true)} />
          )}
        </div>
      </div>
    </Layout>
  );
});
