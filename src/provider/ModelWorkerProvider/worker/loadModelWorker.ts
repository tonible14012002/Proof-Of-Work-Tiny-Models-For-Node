import {
  AutoModelForSequenceClassification,
  AutoTokenizer,
  pipeline,
  PreTrainedModel,
  PreTrainedTokenizer,
  TextClassificationPipeline,
  ZeroShotClassificationPipeline,
  type ProgressInfo,
} from "@huggingface/transformers";
import { MODEL_WORKER_EVENT } from "@/constants/event";
import { endTimer, makeMessage, startTimer } from "@/utils/worker";
import type {
  FileLoadInfo,
  InitModelInput,
  ModelDetail,
  ModelInferenceInput,
  WorkerMessage,
} from "@/schema/model";
import type {
  InitiateProgressInfo,
  DownloadProgressInfo,
  ProgressStatusInfo,
  DoneProgressInfo,
} from "node_modules/@huggingface/transformers/types/utils/core";

type OnLoadModel = (event: ProgressInfo) => void;

type ProgressInput =
  | InitiateProgressInfo
  | DownloadProgressInfo
  | ProgressStatusInfo
  | DoneProgressInfo;

class ModelFactory {
  static modelMap = new Map<string, any>();

  static async initModel(
    modelId: string,
    task: ModelDetail["task"],
    modelPath: string,
    onLoad: OnLoadModel,
    modelConfig?: ModelDetail["config"]
  ) {
    if (this.modelMap.has(modelId)) {
      return this.modelMap.get(modelId);
    }
    if (task === "tokenizer") {
      const fetchModel = AutoModelForSequenceClassification.from_pretrained(
        modelPath,
        {
          progress_callback: onLoad,
          ...(modelConfig ?? {}),
        }
      );

      const fetchTokenizer = AutoTokenizer.from_pretrained(modelPath, {
        progress_callback: onLoad,
        ...(modelConfig ?? {}),
      });

      const [model, tokenizer] = await Promise.all([
        fetchModel,
        fetchTokenizer,
      ]);

      this.modelMap.set(modelId, {
        model,
        tokenizer,
      });
    } else {
      const model = await pipeline(task, modelPath, {
        progress_callback: onLoad,
        ...(modelConfig ?? {}),
      });

      this.modelMap.set(modelId, model);
      return model;
    }
  }

  static async runInferenceModel(
    modelId: string,
    task: ModelDetail["task"],
    input: string | string[],
    params: any
  ) {
    const model = this.modelMap.get(modelId);

    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const latency = performance.now();

    switch (task) {
      case "tokenizer": {
        const tokenizer = model.tokenizer as PreTrainedTokenizer;
        const runModel = model.model as PreTrainedModel;

        const features = await tokenizer(["How much money has been sent?"], {
          text_pair: [input],
          padding: true,
          truncation: true,
        });

        const result = await runModel(features);
        return {
          data: result.logits.data,
          latency: performance.now() - latency,
        };
      }
      case "zero-shot-classification": {
        const typedModel = model as ZeroShotClassificationPipeline;
        // , params?.labels, params?.options
        const result = await typedModel(input, ["payment", "not payment"], {
          hypothesis_template: "This text is {} related",
        });
        return {
          data: result,
          latency: performance.now() - latency,
        };
      }
      case "text-classification": {
        const typedModel = model as TextClassificationPipeline;
        const result = await typedModel(input, params?.options);
        return {
          data: result,
          latency: performance.now() - latency,
        };
      }
    }
  }
}

self.addEventListener("message", async (event) => {
  const message = event.data as WorkerMessage;
  switch (message.type) {
    case MODEL_WORKER_EVENT.MAIN.init_model: {
      eventHandlers.initModel(message.modelId, message.data as InitModelInput);
      break;
    }
    case MODEL_WORKER_EVENT.MAIN.inference: {
      eventHandlers.runInference(
        message.modelId,
        message.data as ModelInferenceInput
      );
    }
  }
});

// Worker Initialize Done
self.postMessage(
  makeMessage({
    modelId: "",
    type: MODEL_WORKER_EVENT.WORKER.worker_ready,
  })
);

const eventHandlers = {
  initModel: async (modelId: string, data: InitModelInput) => {
    const timeTrack = {} as any;
    const loadStatus: Record<string, FileLoadInfo> = {};
    try {
      await ModelFactory.initModel(
        modelId,
        data.task,
        data.modelPath,
        (baseProgress) => {
          if (baseProgress.status !== "ready") {
            const progressInfo = baseProgress as ProgressInput;

            loadStatus[progressInfo.file] = {
              ...(loadStatus[progressInfo.file] || {}),
              ...progressInfo,
            };

            // Fill missing info if not have
            loadStatus[progressInfo.file] = {
              ...loadStatus[progressInfo.file],
              loaded: loadStatus[progressInfo.file].loaded || 0,
              total: loadStatus[progressInfo.file].total || 0,
              progress: loadStatus[progressInfo.file].progress || 0,
              duration: loadStatus[progressInfo.file].duration || 0,
            };

            if (progressInfo.status === "initiate") {
              startTimer(timeTrack, progressInfo.file);
            } else {
              endTimer(timeTrack, progressInfo.file);
            }

            const isAllDownloadDone = Object.values(loadStatus).every(
              (info) => info.status === "done"
            );

            if (isAllDownloadDone) {
              self.postMessage(
                makeMessage({
                  type: MODEL_WORKER_EVENT.WORKER.downloaded,
                  modelId: modelId,
                  data: {
                    timeTrack,
                    loadStatus,
                  },
                })
              );
              startTimer(timeTrack, "modelLoadTime");
            } else {
              self.postMessage(
                makeMessage({
                  type: MODEL_WORKER_EVENT.WORKER.downloading,
                  modelId: modelId,
                  data: {
                    timeTrack,
                    loadStatus,
                  },
                })
              );
            }
          } else {
            self.postMessage(
              makeMessage({
                type: MODEL_WORKER_EVENT.WORKER.loaded,
                modelId: modelId,
                data: {
                  timeTrack,
                  loadStatus,
                },
              })
            );
          }
        },
        data.config
      );
      if (timeTrack["modelLoadTime"]) {
        endTimer(timeTrack, "modelLoadTime");
      }
      self.postMessage(
        makeMessage({
          type: MODEL_WORKER_EVENT.WORKER.ready,
          modelId: modelId,
          data: {
            timeTrack,
            loadStatus,
          },
        })
      );
    } catch (error: any) {
      self.postMessage(
        makeMessage({
          type: MODEL_WORKER_EVENT.WORKER.error,
          modelId: modelId,
          data: {
            error: error?.message || String(error) || "Some error occurred",
          },
        })
      );
    }
  },

  runInference: async (modelId: string, data: ModelInferenceInput) => {
    try {
    const result = await ModelFactory.runInferenceModel(
      modelId,
      data.task,
      data.input,
      data.params
    );
    self.postMessage(
      makeMessage({
        data: result,
        modelId: modelId,
        type: MODEL_WORKER_EVENT.WORKER.inference_complete,
      })
    );
    }
    catch (e: any) {
      self.postMessage(
        makeMessage({
          type: MODEL_WORKER_EVENT.WORKER.error,
          modelId: modelId,
          data: {
            error: e?.message || String(e) || "Some error occurred",
          },
        })
      )
    }
  },
};
