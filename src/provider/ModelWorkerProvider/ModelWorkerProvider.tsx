import { MODEL_WORKER_EVENT, type ModelWorkerEvent } from "@/constants/event";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useRef } from "react";
import { createContext } from "@/lib/utils";
import { makeMessage } from "@/utils/worker";
import type { ModelDetail } from "@/schema/model";

interface ModelWorkerContextValues {
  loadModel: (model: ModelDetail) => Promise<void>;
}

// Custom utils force context MUST be available
const [Provider, useWorkerContext] = createContext<ModelWorkerContextValues>();

export { useWorkerContext };

export const ModelWorkerProvider = ({ children }: PropsWithChildren) => {
  const workerRef = useRef<Worker | null>(null);

  const handleWorkerEvents = useCallback((event: MessageEvent) => {
    if (!workerRef.current) return;
    const message = event.data as {
      type: ModelWorkerEvent;
      data: any;
    };
    console.log("Worker message received:", message);
  }, []);

  const onLoadModel = async (model: ModelDetail) => {
    if (!workerRef.current) return;
    workerRef.current.postMessage(
      makeMessage({
        type: MODEL_WORKER_EVENT.MAIN.init_model,
        data: {
          task: model.task,
          modelPath: model.model,
          config: model.config || {},
        },
      })
    );
  };

  useEffect(() => {
    workerRef.current ??= new Worker(
      new URL("./worker/loadModelWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    const workerRefCleaner = workerRef.current;
    workerRefCleaner.addEventListener("message", handleWorkerEvents);

    return () => {
      workerRefCleaner.removeEventListener("message", handleWorkerEvents);
    };
  }, [handleWorkerEvents]);

  return (
    <Provider
      value={{
        loadModel: onLoadModel,
      }}
    >
      {children}
    </Provider>
  );
};
