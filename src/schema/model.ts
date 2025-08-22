import type { ModelMainEvent, ModelWorkerEvent } from "@/constants/event";
import type { PretrainedModelOptions } from "@huggingface/transformers";

export type ModelDetail = {
  id: string;
  name: string;
  modelPath: string;
  config?: Omit<PretrainedModelOptions, "progress_callback">
  task: "text-classification" | "zero-shot-classification" | "feature-extraction" | "tokenizer";

  // Loading information
  loadFiles: Record<string, FileLoadInfo>;
  loadTime?: number;
  loaded: boolean
};

export type FileLoadInfo = {
  file: string;
  name: string;
  progress: number
  loaded: number
  total: number
  status: "initiate" | "download" | "progress" | "done"
  duration: number
}

export type ModelConfig = {
  dtype?: "q4" | "q8" | "fp16"
}

export type InitModelInput = {
  task: ModelDetail["task"];
  modelPath: string;
}

export type ModelInferenceInput = {
  task: ModelDetail['task'];
  input: string | string[];
  params: any;
}

export type WorkerMessage<T = any> = {
  modelId: string;
  type: ModelMainEvent | ModelWorkerEvent;
  data?: T;
}

export type InferenceResult = {
  data: string;
  latency: number;
}