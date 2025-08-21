import type { PretrainedModelOptions } from "@huggingface/transformers";

export type ModelDetail = {
  id: string;
  name: string;
  file?: string;
  status?: string;
  progress?: number;
  loaded?: number;
  total?: number;
  task: "text-classification";
  model?: string;
  size?: number;
  latency?: number;
  loadTime?: number;
  config?: Omit<PretrainedModelOptions, "progress_callback">
};

export type ModelConfig = {
  dtype?: "q4" | "q8" | "fp16"
}

export type InitModelInput = {
  task: "text-classification";
  modelPath: string;
}