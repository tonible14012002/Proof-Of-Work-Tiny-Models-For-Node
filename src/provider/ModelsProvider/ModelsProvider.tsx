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
import { DEFAULT_MODELS } from "@/constants/model";
import { useWorkerContext } from "../ModelWorkerProvider";
import { MODEL_WORKER_EVENT } from "@/constants/event";
import { toast } from "sonner";
import { loadStatusFromWorkerData } from "@/utils/model";

interface ModelContextValues {
  mutateList: (id: string, data: ModelDetail) => void;
  models: ModelDetail[];
  setModelLoading: (id: string, loading: boolean) => void;
  setModels: Dispatch<React.SetStateAction<ModelDetail[]>>;
  isInfering?: boolean;
  setIsInfering: Dispatch<React.SetStateAction<boolean>>;
}

const [Provider, useModels] = createContext<ModelContextValues>();

export { useModels };

export const ModelsProvider = memo(({ children }: PropsWithChildren) => {
  const [models, setModels] = useState<ModelDetail[]>(DEFAULT_MODELS);
  const { worker, isWorkerReady } = useWorkerContext();
  const [isInfering, setIsInfering] = useState<boolean>(false);

  const onLoadModelProgress = useCallback((event: MessageEvent) => {
    const data = event.data as WorkerMessage;

    if (
      [
        MODEL_WORKER_EVENT.WORKER.downloading,
        MODEL_WORKER_EVENT.WORKER.downloaded,
        MODEL_WORKER_EVENT.WORKER.loaded,
      ].includes(data.type as any)
    ) {
      const { fileStatus, loadTime } = loadStatusFromWorkerData(data.data);

      setModels((prev) => {
        return prev.map((model) =>
          model.id === data.modelId
            ? {
                ...model,
                loadFiles: fileStatus,
                loadTime,
              }
            : model
        );
      });
    }

    if (data.type === MODEL_WORKER_EVENT.WORKER.ready) {
      // setModelLoading(data.modelId, false);
      const timeTrack = data.data?.timeTrack ?? {};
      console.log({ timeTrack });
      setModels((prev) =>
        prev.map((model) =>
          model.id === data.modelId
            ? {
                ...model,
                loading: false,
                loadTime:
                  Math.round((timeTrack.modelLoadTime?.duration ?? 0) * 100) /
                    100 || 0,
                loaded: true,
              }
            : model
        )
      );
    }
    if (data.type === MODEL_WORKER_EVENT.WORKER.error) {
      setModels((prev) =>
        prev.map((model) =>
          model.id === data.modelId ? { ...model, loading: false } : model
        )
      );

      const error = data.data?.error ?? "Unknown error";
      toast.error(`Model ${data.modelId} error: ${error}`);
    }
  }, []);

  useEffect(() => {
    if (!isWorkerReady || worker.current === null) return;

    worker.current.addEventListener("message", onLoadModelProgress);
    const workerRefCleaner = worker.current;

    return () => {
      workerRefCleaner.removeEventListener("message", onLoadModelProgress);
    };
  }, [isWorkerReady, onLoadModelProgress, worker]);

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
    <Provider
      value={{
        mutateList,
        models,
        setModelLoading,
        setModels,
        isInfering,
        setIsInfering,
      }}
    >
      {children}
    </Provider>
  );
});
