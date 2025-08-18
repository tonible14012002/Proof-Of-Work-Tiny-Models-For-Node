import type { ModelDetail } from "@/schema/model";

export const DEFAULT_MODELS: ModelDetail[] = [
  {
    id: "tinybert-l2-int8",
    name: "Xenova/ms-marco-TinyBERT-L-2-v2",
    size: 4.5,
    latency: 35,
    task: "text-classification",
    model: "Xenova/ms-marco-TinyBERT-L-2-v2"
  },
  {
    id: "tinybert-l2-fp16",
    name: "Xenova/ms-marco-TinyBERT-L-2-v2", // FP16 version
    size: 8.8,
    task: "text-classification",
    model: "Xenova/ms-marco-TinyBERT-L-2-v2"
  },
  {
    id: "minilm-l12-int8",
    name: "Xenova/ms-marco-MiniLM-L-12-v2",
    size: 23,
    latency: 70,
    task: "text-classification",
    model: "Xenova/ms-marco-MiniLM-L-12-v2"
  },
  {
    id: "bge-small-en-int8",
    name: "Xenova/bge-small-en",
    size: 45.9,
    latency: 110,
    task: "text-classification",
    model: "Xenova/bge-small-en"
  },
  {
    id: "gte-hny",
    name: "Xenova/gte-small", // Approx mapping, multilingual
    size: 45.5,
    latency: 120,
    task: "text-classification",
    model: "Xenova/gte-small"
  },
  {
    id: "tinybert-4l-312d",
    name: "Xenova/TinyBERT-4L-312D",
    size: 62.7,
    latency: 140,
    task: "token-classification",
    model: "Xenova/TinyBERT-4L-312D"
  },
  {
    id: "minilm-l6-v2-int8",
    name: "Xenova/all-MiniLM-L6-v2",
    size: 80,
    latency: 180,
    task: "text-classification",
    model: "Xenova/all-MiniLM-L6-v2"
  },
  {
    id: "paraphrase-minilm-l3-v2-int8",
    name: "Xenova/paraphrase-MiniLM-L3-v2",
    size: 69.6,
    latency: 160,
    task: "text-classification",
    model: "Xenova/paraphrase-MiniLM-L3-v2"
  },
  {
    id: "e5-small-v2-int8",
    name: "Xenova/e5-small-v2",
    size: 133,
    latency: 240,
    task: "text-classification",
    model: "Xenova/e5-small-v2"
  },
  {
    id: "qwen-0.5b-instruct",
    name: "Qwen/Qwen2.5-0.5B-Instruct", // not natively in transformers.js, but for WebLLM
    size: 385,
    task: "text-generation",
    model: "Qwen/Qwen2.5-0.5B-Instruct"
  }
];
