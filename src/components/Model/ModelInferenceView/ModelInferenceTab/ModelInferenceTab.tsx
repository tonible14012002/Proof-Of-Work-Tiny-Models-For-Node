import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MODEL_WORKER_EVENT } from "@/constants/event";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import type {
  InferenceResult,
  ModelDetail,
  WorkerMessage,
} from "@/schema/model";
import { useCallback, useEffect, useState } from "react";

interface ModelInferenceTabProps {
  model: ModelDetail;
}

export const ModelInferenceTab = (props: ModelInferenceTabProps) => {
  const { model } = props;

  const [inputValue, setInputValue] = useState("");
  const { runModel, worker } = useWorkerContext();

  const [result, setResult] = useState<{
    latency: number;
    data: string;
  }>();

  const onModelInferenceResponse = useCallback((event: MessageEvent) => {
    const payload = event.data as WorkerMessage;
    if (payload.type === MODEL_WORKER_EVENT.WORKER.inference_complete) {
      const { latency, data } = payload.data as InferenceResult;
      const displayData =
        typeof data === "object" ? JSON.stringify(data) : data;
      setResult({ latency, data: displayData });
    }
  }, []);

  useEffect(() => {
    if (!worker.current) return;

    worker.current.addEventListener("message", onModelInferenceResponse);
    const workerRefCleaner = worker.current;

    return () => {
      workerRefCleaner.removeEventListener("message", onModelInferenceResponse);
    };
  }, [onModelInferenceResponse, worker]);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;
    const labels = ["payment", "not payment"];
    runModel(model.id, model.task, val, {
      labels,
      options: {
        hypothesis_template: "This text is {label} related.",
      },
    });
  };

  return (
    <>
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <h2 className="text-lg font-semibold">Inference</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="user-input"
            >
              User input
            </label>
            <Textarea
              id="user-input"
              cols={5}
              className="min-h-[100px]"
              value={inputValue}
              onChange={onChange}
            />
          </div>
          <Button className="w-full" variant="default" type="submit">
            Submit
          </Button>
        </div>
      </form>
      <div className="rounded-lg space-y-2 p-4 mt-4 border">
        <h3 className="font-medium text-lg">Inference Result</h3>
        <div className="flex flex-wrap gap-2">
          {result?.latency && (
            <Badge variant="default">
              Latency: {Math.round(result.latency * 100) / 100}ms
            </Badge>
          )}
        </div>
        <div className="mt-4 bg-muted p-4 rounded-lg break-words">
          {result ? (
            <>{result.data}</>
          ) : (
            <span className="text-sm text-muted-foreground">
              Empty.
            </span>
          )}
        </div>
      </div>
    </>
  );
};
