import {
  pipeline,
  type PipelineType,
  type ProgressInfo,
} from "@huggingface/transformers";
import { MODEL_WORKER_EVENT, type ModelMainEvent } from "@/constants/event";
import { makeMessage } from "@/utils/worker";
import type { InitModelInput } from "@/schema/model";

type OnLoadModel = (event: ProgressInfo) => void;

class ModelFactory {
  static modelMap = new Map<string, any>();

  static initModel(task: PipelineType, modelPath: string, onLoad: OnLoadModel) {
    if (this.modelMap.has(modelPath)) {
      return this.modelMap.get(modelPath);
    }
    const model = pipeline(task, modelPath, {
      progress_callback: onLoad,
    });

    this.modelMap.set(modelPath, model);

    return model;
  }
}

self.addEventListener("message", async (event) => {
  // Handle incoming messages
  const message = event.data as {
    type: ModelMainEvent;
    data: any;
  };
  switch (message.type) {
    case MODEL_WORKER_EVENT.MAIN.init_model: {
      const data = message.data as InitModelInput;
      const timeTrack = {
        downloadTime: 0,
        initDownloadTime: 0,
        loadTime: 0,
        initLoadTime: 0,
      };
      ModelFactory.initModel(data.task, data.modelPath, (progress) => {
        // Time Track
        if (progress.status === "download") {
          if (!timeTrack.initDownloadTime) {
            // Start track download
            timeTrack.initDownloadTime = performance.now();
          }
          timeTrack.downloadTime =
            performance.now() - timeTrack.initDownloadTime;
        }
        if (progress.status === "done") {
          //  Finish download Time
          timeTrack.downloadTime =
            performance.now() - timeTrack.initDownloadTime;
          if (!timeTrack.initLoadTime) {
            // Start track load
            timeTrack.initLoadTime = performance.now();
          }
          timeTrack.loadTime = performance.now() - timeTrack.initLoadTime;
        }

        if (progress.status === "done") {
          // Finished loading
          timeTrack.loadTime = performance.now() - timeTrack.initLoadTime;
        }

        if (progress.status === "progress") {
          self.postMessage(
            makeMessage({
              type: MODEL_WORKER_EVENT.WORKER.downloading,
              data: {
                downloadTime: timeTrack.downloadTime,
              },
            })
          );
        }

        if (progress.status === "ready") {
          self.postMessage(
            makeMessage({
              type: MODEL_WORKER_EVENT.WORKER.ready,
              data: {
                loadTime: timeTrack.loadTime,
              },
            })
          );
        }
      });
    }
  }
});

// Worker Initialize Done
self.postMessage(
  makeMessage({
    type: MODEL_WORKER_EVENT.WORKER.worker_ready,
  })
);
