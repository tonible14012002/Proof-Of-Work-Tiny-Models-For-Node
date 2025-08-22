import type { ModelDetail } from "@/schema/model";
import { dynamic_time_warping } from "@huggingface/transformers";

export const DEFAULT_MODELS: ModelDetail[] = [
  {
    id: "Xenova/ms-marco-TinyBERT-L-2-v2 INT8",
    name: "Xenova/ms-marco-TinyBERT-L-2-v2",
    modelPath: "Xenova/ms-marco-TinyBERT-L-2-v2",
    // For loading model
    task: "tokenizer",
    config: {
      dtype: "int8",
      device: "webgpu",
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
      device: "webgpu",
    },
    loadFiles: {},
    loaded: false,
  },
  // Not Supported
  // {
  //   id: "cross-encoder/ms-marco-MiniLM-L12-v2",
  //   name: "cross-encoder/ms-marco-MiniLM-L12-v2",
  //   task: "tokenizer",
  //   config: {
  //     dtype: "int8",
  //     device: "webgpu",
  //   },
  //   loadFiles: {},
  //   loaded: false,
  // }
  {
    id: "BAAI/bge-small-en INT8",
    name: "BAAI/bge-small-en",
    modelPath: "BAAI/bge-small-en",
    task: "tokenizer",
    config: {
      dtype: "int8",
      device: "webgpu",
    },
    loadFiles: {},
    loaded: false,
  },
  {
    id: "TaylorAI/gte-tiny",
    name: "TaylorAI/gte-tiny",
    modelPath: "TaylorAI/gte-tiny",
    task: "tokenizer",
    config: {
      device: "webgpu",
    },
    loadFiles: {},
    loaded: false,
  },
  {
    id: "Xenova/bge-small-en-v1.5",
    name: "Xenova/bge-small-en-v1.5",
    modelPath: "Xenova/bge-small-en-v1.5",
    task: "zero-shot-classification",
    config: {
      device: "webgpu",
    },
    loadFiles: {},
    loaded: false,
  },
  // huawei-noah/TinyBERT_General_4L_312D
  // sentence-transformers/all-MiniLM-L6-v2
  // sentence-transformers/paraphrase-MiniLM-L3-v2s
  // E5-small-v2
  // Qwen 2.5-0.5B-Instruct Q4_K_S
];
