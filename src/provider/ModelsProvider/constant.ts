import type { ModelDetail } from "@/schema/model";

export const DEFAULT_MODELS: ModelDetail[] = [
  {
    id: "Xenova/ms-marco-TinyBERT-L-2-v2",
    name: "Xenova/ms-marco-TinyBERT-L-2-v2",
    size: 0,
    latency: 0,
    // For loading model
    task: "text-classification",
    model: "Xenova/ms-marco-TinyBERT-L-2-v2",
    config: {
      dtype: "int8",
    }
  },
];
