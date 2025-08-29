import { createContext } from "@/lib/utils";
import type { ModelDetail, WorkerMessage } from "@/schema/model";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
} from "react";
import { DEFAULT_MODELS } from "./constant";
import { useWorkerContext } from "../ModelWorkerProvider";
import { MODEL_WORKER_EVENT } from "@/constants/event";
import { toast } from "sonner";

interface ModelContextValues {
  mutateList: (id: string, data: ModelDetail) => void;
  models: ModelDetail[];
  setModelLoading: (id: string, loading: boolean) => void;
  setModels: Dispatch<React.SetStateAction<ModelDetail[]>>;
}

const [Provider, useModels] = createContext<ModelContextValues>();

export { useModels };

export const ModelsProvider = memo(({ children }: PropsWithChildren) => {
  const [models, setModels] = useState<ModelDetail[]>(DEFAULT_MODELS);
  const { worker } = useWorkerContext();

  const onLoadModelProgress = useCallback((event: MessageEvent) => {
    const data = event.data as WorkerMessage;
    if (data.type === MODEL_WORKER_EVENT.WORKER.ready) {
      setModelLoading(data.modelId, false);
    }
    if (data.type === MODEL_WORKER_EVENT.WORKER.error) {
      setModelLoading(data.modelId, false);
      const error = data.data?.error ?? "Unknown error";
      toast.error(`Model ${data.modelId} error: ${error}`);
    }
  }, []);

  useEffect(() => {
    if (!worker.current) return;

    worker.current.addEventListener("message", onLoadModelProgress);
    const workerRefCleaner = worker.current;

    return () => {
      workerRefCleaner.removeEventListener("message", onLoadModelProgress);
    };
  }, [onLoadModelProgress, worker]);

  const mutateList = (id: string, data: ModelDetail) => {
    setModels((prevModels) =>
      prevModels.map((model) => (model.id === id ? data : model))
    );
  };

  const setModelLoading = (id: string, loading: boolean) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model.id === id ? { ...model, loading } : model
      )
    );
  };

  return (
    <Provider value={{ mutateList, models, setModelLoading, setModels }}>
      {children}
    </Provider>
  );
});
