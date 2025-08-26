import type { ModelMainEvent, ModelWorkerEvent } from "@/constants/event";
import { type PretrainedModelOptions } from "@huggingface/transformers";

import type { DType } from "@/constants/model";

export type ModelDetail = {
  id: string;
  name: string;
  modelPath: string;
  config?: Omit<PretrainedModelOptions, "progress_callback">;
  dtype?: DType;
  task:
    | "text-classification"
    | "zero-shot-classification"
    | "feature-extraction"
    | "summarization"
    | "text2text-generation" // for text2text-generation pipeline
    | "sentiment-analysis"
    | "token-classification"
    // Custom Task For manual lowerlevel API
    | "none-pipline-supported";

  // Loading information
  loadFiles: Record<string, FileLoadInfo>;
  loadTime?: number;
  loaded: boolean;
};

export type FileLoadInfo = {
  file: string;
  name: string;
  progress: number;
  loaded: number;
  total: number;
  status: "initiate" | "download" | "progress" | "done";
  duration: number;
};

export type InitModelInput = {
  task: ModelDetail["task"];
  modelPath: string;
  config?: ModelDetail["config"];
  dtype?: DType;
};

export type ModelInferenceInput = {
  task: ModelDetail["task"];
  input: string | string[];
  params: {
    options?: any;
  };
};

export type WorkerMessage<T = any> = {
  modelId: string;
  type: ModelMainEvent | ModelWorkerEvent;
  threadId?: string;
  data?: T;
};

export type BaseInferenceResult<T = any> = {
  data: T;
  latency: number;
};

export type SummarizerResult = BaseInferenceResult<{ summary_text: string }[]>;

export type SentimentAnalysisResult = BaseInferenceResult<
  { label: string; score: number }[]
>;

export type Text2TextGenerationResult = BaseInferenceResult<
  { generated_text: string }[]
>;

export type ZeroShotClassificationResult = BaseInferenceResult<{
  sequence: string;
  labels: string[];
  scores: number[];
}>;

export type TokenClassificationResult = BaseInferenceResult<
  {
    entity: string;
    score: number;
    index: number;
    word: string;
  }[]
>;
