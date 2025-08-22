import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  FileLoadInfo,
  ModelDetail,
  WorkerMessage,
} from "@/schema/model";
import { DownloadIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ModelInferenceTab } from "./ModelInferenceTab";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import { toast } from "sonner";
import { MODEL_WORKER_EVENT } from "@/constants/event";
import { useModels } from "@/provider/ModelsProvider";

interface ModelInferenceViewProps {
  selectedModel: ModelDetail;
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

  const [model, setModel] = useState(selectedModel);
  const { worker, loadModel } = useWorkerContext();
  const { mutateList, models } = useModels();

  const isSaved = useMemo(() => {
    const modelFromList = models.find((m) => m.id === model.id);
    return JSON.stringify(modelFromList) === JSON.stringify(model);
  }, [model, models]);

  const onLoadModelBtn = () => {
    if (!selectedModel) return;
    loadModel(selectedModel);
  };

  const handleExport = () => {
    console.log("Exporting model...");
    toast.warning("Model Exporting is not supported yet");
  };

  const onLoadModelProgress = useCallback(
    (event: MessageEvent) => {
      const data = event.data as WorkerMessage;
      if (data.modelId !== model.id) return;

      if (
        [
          MODEL_WORKER_EVENT.WORKER.downloading,
          MODEL_WORKER_EVENT.WORKER.downloaded,
          MODEL_WORKER_EVENT.WORKER.loaded,
        ].includes(data.type as any)
      ) {
        const timeTrack = data.data?.timeTrack;
        const loadFilesStatus = Object.keys(data.data.loadStatus).reduce(
          (acc, file) => {
            acc[file] = {
              ...data.data.loadStatus[file],
              duration: timeTrack[file]?.duration || 0,
            };
            return acc;
          },
          {} as Record<string, FileLoadInfo>
        );

        setModel((prev) => ({
          ...prev,
          loadFiles: loadFilesStatus,
          loadTime:
            Math.round((timeTrack.modelLoadTime?.duration ?? 0) * 100) / 100 ||
            0,
        }));
      }

      if (data.type === MODEL_WORKER_EVENT.WORKER.ready) {
        const timeTrack = data.data?.timeTrack ?? {};
        setModel((prev) => {
          return {
            ...prev,
            loaded: true,
            loadTime:
              Math.round((timeTrack.modelLoadTime?.duration ?? 0) * 100) /
                100 || 0,
          };
        });
      }
    },
    [model.id]
  );

  useEffect(() => {
    if (!worker.current) return;

    worker.current.addEventListener("message", onLoadModelProgress);
    const workerRefCleaner = worker.current;

    return () => {
      workerRefCleaner.removeEventListener("message", onLoadModelProgress);
    };
  }, [onLoadModelProgress, worker]);

  useEffect(() => {
    if (!isSaved) {
      mutateList(model.id, model);
    }
  }, [isSaved, model, mutateList]);

  const fileLoadInfo = Object.entries(model.loadFiles || {}).reduce(
    (acc, [file, info]) => {
      acc[file] = Math.round(info.duration * 100) / 100 + " ms";
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="">
        <h1 className="text-3xl font-bold">{model.name}</h1>
        <p className="text-muted-foreground">{model.task}</p>
      </div>
      <Tabs value={mode} onValueChange={setMode} className="flex-1 min-h-0">
        <div className="flex justify-between gap-4 mt-4">
          <TabsList>
            <TabsTrigger value={MODES.INFERENCE}>Inference Mode</TabsTrigger>
            <TabsTrigger value={MODES.FINETUNING}>Fine Tuning Mode</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              onClick={onLoadModelBtn}
              size="sm"
              disabled={Boolean(model.loaded)}
            >
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
                "Model Name": model.name,
                Task: model.task,
                Status: model.loaded ? "Loaded" : "Not loaded",
                "D type": model.config?.dtype ?? "_"
              }}
            />
            <ConfigInfo
              title="Load Information"
              infos={{
                ...fileLoadInfo,
                "Model Load time": (model.loadTime ?? 0) + " ms",
              }}
            />
            <ConfigInfo
              title="Benchmark"
              infos={{
                "Average Latency": "0 ms",
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

  const isEmpty = Object.keys(infos).length === 0;

  return (
    <div className="p-3 rounded-xl border ">
      <div className="mb-3">
        <h3 className="font-semibold text-sm">{props.title}</h3>
      </div>
      <div className="flex flex-col gap-1">
        {isEmpty ? (
          <span className="text-muted-foreground text-xs">
            No information available
          </span>
        ) : null}
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
