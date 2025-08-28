import { MODEL_WORKER_EVENT } from "@/constants/event";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import type { AutomaticSpeechRecognitionResult, WorkerMessage } from "@/schema/model";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export type AutomaticSpeechRecognitionInputParams = {
  text: string | string[];
  options?: {
    language?: string;
    return_timestamps?: boolean;
  };
};

type ASRResolver = (_: AutomaticSpeechRecognitionResult) => void;

export const useInferenceAutomaticSpeechRecognition = (modelId?: string) => {
  const { worker, runModel } = useWorkerContext();
  const [isPending, setIsPending] = useState(false);
  const [inferenceId, setInferenceId] = useState("");
  const waiterPromiseRef = useRef<{
    resolver: ASRResolver;
    rejecter: (reason?: any) => void;
  }>(null);

  const initWaiter = async () => {
    return new Promise((resolve: ASRResolver, reject) => {
      waiterPromiseRef.current = {
        resolver: resolve,
        rejecter: reject,
      };
    });
  };
  const resetWaiter = () => {
    waiterPromiseRef.current = null;
  };


  const transcribe = async (input: AutomaticSpeechRecognitionInputParams) => {
    if (!modelId) {
      return;
    }
    if (waiterPromiseRef.current) {
      return;
    }
    try {
      setIsPending(true);
      const newInferenceId = uuidv4();
      setInferenceId(newInferenceId);
      
      // TODO: Implement pipeline call
      await runModel(
        modelId,
        "automatic-speech-recognition",
        input.text,
        {
          options: input.options,
        },
        newInferenceId
      );
      const result = await initWaiter();
      setIsPending(false);
      return result;
    } catch (e: any) {
      console.error(e);
      toast("Error occurred while transcribing audio", {
        description: e?.message || "Unknown Error",
      });
      resetWaiter();
    }
    setIsPending(false);
  };

  const handleResponse = useCallback(
    (e: MessageEvent) => {
      const msgData = e.data as WorkerMessage;
      const { type, data, threadId } = msgData;

      if (threadId !== inferenceId) {
        return;
      }

      if (type === MODEL_WORKER_EVENT.WORKER.inference_complete) {
        waiterPromiseRef.current?.resolver(data);
        waiterPromiseRef.current = null;
      }

      if (type === MODEL_WORKER_EVENT.WORKER.error) {
        waiterPromiseRef.current?.rejecter(data);
      }
    },
    [inferenceId]
  );

  useEffect(() => {
    if (!modelId) return;
    worker.current?.addEventListener("message", handleResponse);
    const clearRef = worker.current;
    return () => {
      clearRef?.removeEventListener("message", handleResponse);
    };
  }, [handleResponse, modelId, worker]);

  return {
    transcribe,
    isPending,
  };
};