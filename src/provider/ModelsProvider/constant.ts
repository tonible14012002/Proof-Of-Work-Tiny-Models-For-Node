import type { ModelDetail } from "@/schema/model";

export const DEFAULT_MODELS: ModelDetail[] = [
  // {
  //   id: "Xenova/ms-marco-TinyBERT-L-2-v2 INT8",
  //   name: "Xenova/ms-marco-TinyBERT-L-2-v2",
  //   modelPath: "Xenova/ms-marco-TinyBERT-L-2-v2",
  //   // For loading model
  //   task: "none-pipline-supported",
  //   config: {
  //     dtype: "int8",
  //   },
  //   loadFiles: {},
  //   loaded: false,
  // },
  // {
  //   id: "Xenova/ms-marco-TinyBERT-L-2-v2 FP16",
  //   name: "Xenova/ms-marco-TinyBERT-L-2-v2",
  //   modelPath: "Xenova/ms-marco-TinyBERT-L-2-v2",
  //   task: "none-pipline-supported",
  //   config: {
  //     dtype: "fp16",
  //   },
  //   loadFiles: {},
  //   loaded: false,
  // },
  // {
  //   id: "BAAI/bge-small-en INT8",
  //   name: "BAAI/bge-small-en",
  //   modelPath: "BAAI/bge-small-en",
  //   task: "none-pipline-supported",
  //   config: {
  //     dtype: "int8",
  //   },
  //   loadFiles: {},
  //   loaded: false,
  // },
  // {
  //   id: "TaylorAI/gte-tiny",
  //   name: "TaylorAI/gte-tiny",
  //   modelPath: "TaylorAI/gte-tiny",
  //   task: "none-pipline-supported",
  //   config: {},
  //   loadFiles: {},
  //   loaded: false,
  // },
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
    {
    id: "Xenova/mobilebert-uncased-mnli",
    name: "Xenova/mobilebert-uncased-mnli",
    modelPath: "Xenova/mobilebert-uncased-mnli",
    task: "zero-shot-classification",
    config: {
      device: "auto",
    },
    loadFiles: {},
    loaded: false,
  },
    {
    id: "Xenova/bart-large-cnn",
    name: "Xenova/bart-large-cnn",
    modelPath: "Xenova/bart-large-cnn",
    task: "summarization",
    config: {
    },
    loadFiles: {},
    loaded: false,
  },
  {
    id: "Xenova/distilbart-cnn-6-6",
    name: "Xenova/distilbart-cnn-6-6",
    modelPath: "Xenova/distilbart-cnn-6-6",
    task: "summarization",
    config: {
    },
    loadFiles: {},
    loaded: false,
  },
    {
    id: "Xenova/bert-base-multilingual-cased-ner-hrl",
    name: "Xenova/bert-base-multilingual-cased-ner-hrl",
    modelPath: "Xenova/bert-base-multilingual-cased-ner-hrl",
    task: "token-classification",
    config: {
    },
    loadFiles: {},
    loaded: false,
  },
  
  // {
  //   id: "Xenova/t5-small",
  //   name: "Xenova/t5-small",
  //   modelPath: "Xenova/t5-small",
  //   task: "text2text-generation",
  //   config: {
  //   },
  //   loadFiles: {},
  //   loaded: false,
  // },
  {
    id: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    name: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    modelPath: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    task: "sentiment-analysis",
    config: {
    },
    loadFiles: {},
    loaded: false,
  }
];
