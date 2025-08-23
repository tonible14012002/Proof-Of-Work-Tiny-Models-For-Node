import type { ModelDetail } from "@/schema/model";

export const DEFAULT_MODELS: ModelDetail[] = [
  {
    id: "Xenova/ms-marco-TinyBERT-L-2-v2 INT8",
    name: "Xenova/ms-marco-TinyBERT-L-2-v2",
    modelPath: "Xenova/ms-marco-TinyBERT-L-2-v2",
    // For loading model
    task: "tokenizer",
    config: {
      dtype: "int8",
    },
    loadFiles: {},
    loaded: false,
  },
  {
    id: "Xenova/ms-marco-TinyBERT-L-2-v2 FP16",
    name: "Xenova/ms-marco-TinyBERT-L-2-v2",
    modelPath: "Xenova/ms-marco-TinyBERT-L-2-v2",
    task: "tokenizer",
    config: {
      dtype: "fp16",
    },
    loadFiles: {},
    loaded: false,
  },
  {
    id: "BAAI/bge-small-en INT8",
    name: "BAAI/bge-small-en",
    modelPath: "BAAI/bge-small-en",
    task: "tokenizer",
    config: {
      dtype: "int8",
    },
    loadFiles: {},
    loaded: false,
  },
  {
    id: "TaylorAI/gte-tiny",
    name: "TaylorAI/gte-tiny",
    modelPath: "TaylorAI/gte-tiny",
    task: "tokenizer",
    config: {},
    loadFiles: {},
    loaded: false,
  },
  {
    id: "Xenova/bge-small-en-v1.5",
    name: "Xenova/bge-small-en-v1.5",
    modelPath: "Xenova/bge-small-en-v1.5",
    task: "zero-shot-classification",
    config: {
      device: "auto",
    },
    loadFiles: {},
    loaded: false,
  },
    {
    id: "Xenova/distilbert-base-uncased-mnli",
    name: "Xenova/distilbert-base-uncased-mnli",
    modelPath: "Xenova/distilbert-base-uncased-mnli",
    task: "zero-shot-classification",
    config: {
      device: "auto",
    },
    loadFiles: {},
    loaded: false,
  },
];
