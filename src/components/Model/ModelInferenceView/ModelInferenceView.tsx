import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ModelDetail } from "@/schema/model";
import { DownloadIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { ModelInferenceTab } from "./ModelInferenceTab";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import { toast } from "sonner";

interface ModelInferenceViewProps {
  selectedModel?: ModelDetail;
}

const MODES = {
  FINETUNING: "fine-tuning",
  INFERENCE: "inference",
};
type ModeType = (typeof MODES)[keyof typeof MODES];

export const ModelInferenceView = ({
  selectedModel,
}: ModelInferenceViewProps) => {
  const [mode, setMode] = useState<ModeType>(MODES.INFERENCE);
  const { loadModel } = useWorkerContext();

  const onLoadModelBtn = () => {
    if (!selectedModel) return;
    loadModel(selectedModel);
  };

  const handleExport = () => {
    console.log("Exporting model...");
    toast.warning("Model Exporting is not supported yet");
  };

  if (!selectedModel) return null;
  return (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="">
        <h1 className="text-3xl font-bold">{selectedModel.name}</h1>
        <p className="text-muted-foreground">{selectedModel.task}</p>
      </div>
      <Tabs value={mode} onValueChange={setMode} className="flex-1 min-h-0">
        <div className="flex justify-between gap-4 mt-4">
          <TabsList>
            <TabsTrigger value={MODES.INFERENCE}>Inference Mode</TabsTrigger>
            <TabsTrigger value={MODES.FINETUNING}>Fine Tuning Mode</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button onClick={onLoadModelBtn} size="sm" variant="outline">
              Load Model
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <DownloadIcon />
              Export
            </Button>
            <Button size="sm" className="w-8 h-8" variant="destructive">
              <TrashIcon />
            </Button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 py-4 -mx-4 px-4">
          <div className="w-full grid grid-cols-3 gap-4 mb-4">
            <ConfigInfo
              title="Basic Information"
              infos={{
                "Model Name": selectedModel.name,
                Task: selectedModel.task,
                Status: "Not loaded",
              }}
            />
            <ConfigInfo
              title="Performance"
              infos={{
                "Average Latency": selectedModel.latency + " ms",
                "Load time": selectedModel.loadTime + " ms",
              }}
            />
            <ConfigInfo
              title="Benchmark"
              infos={{
                "Average Latency": selectedModel.latency + " ms",
                Accuracy: 0,
                "F1 Score": 0,
              }}
            />
          </div>
          <TabsContent value={MODES.INFERENCE}>
            <ModelInferenceTab model={selectedModel} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

interface ConfigInfo {
  infos: Record<string, unknown>;
  title?: string;
}

const ConfigInfo = (props: ConfigInfo) => {
  const { infos } = props;

  return (
    <div className="p-3 rounded-xl border ">
      <div className="mb-3">
        <h3 className="font-semibold text-sm">{props.title}</h3>
      </div>
      <div className="flex flex-col gap-1">
        {Object.entries(infos).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4">
            <span className="text-xs shrink-0">{key}</span>
            <span className="text-muted-foreground text-xs truncate">
              {String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
