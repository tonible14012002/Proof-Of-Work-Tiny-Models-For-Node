import type { ModelDetail } from "@/schema/model";
import { ModelItem } from "./ModelItem";

interface ModelListProps {
  modelDetails: ModelDetail[];
  onSelectModel: (model: ModelDetail) => void;
}

export const ModelList = (props: ModelListProps) => {
  const { modelDetails, onSelectModel } = props;

  return (
    <div className="flex flex-col gap-2">
      {modelDetails.map((model) => (
        <ModelItem key={model.id} modelDetail={model} onSelect={onSelectModel} />
      ))}
    </div>
  );
};
