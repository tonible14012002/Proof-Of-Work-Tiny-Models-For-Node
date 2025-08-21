import React from "react";
import { type ModelDetail } from "@/schema/model";
import { TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatReadableFileSize } from "@/utils/format";

type ModelItemProps = {
  modelDetail: ModelDetail;
  onSelect: (model: ModelDetail) => void;
};

export const ModelItem: React.FC<ModelItemProps> = ({
  modelDetail,
  onSelect,
}) => {
  return (
    <div
      className="w-full rounded-md p-2 hover:bg-accent transition-colors cursor-pointer border"
      onClick={() => onSelect(modelDetail)}
    >
      <div className="flex gap-4">
        <div className="flex flex-col flex-1">
          <p className="text-sm font-medium line-clamp-2">{modelDetail.name}</p>
          <span className="text-xs text-muted-foreground mt-px">
            {modelDetail.task ?? "No task assigned"}
          </span>
          <div className="progress-group flex gap-1 mt-2">
            <TimerIcon size={14} />
            <p className="text-xs text-muted-foreground">
              {modelDetail.loadTime}ms
            </p>
          </div>
        </div>
        <div className="">
          {modelDetail.size !== undefined && (
            <Badge variant="outline">
              {formatReadableFileSize(modelDetail.size)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
