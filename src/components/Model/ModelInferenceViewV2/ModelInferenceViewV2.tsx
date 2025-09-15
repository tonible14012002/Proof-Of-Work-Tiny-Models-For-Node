import { ROUTES } from "@/constants/routes";
import { useModels } from "@/provider/ModelsProvider";
import { useNavigate, useParams } from "@tanstack/react-router";
import { LoaderCircle, Heart } from "lucide-react";
import { useEffect, useState } from "react";

// Import V2 Form Components
import {
  ZeroShotClassificationFormV2,
  SentimentAnalysisFormV2,
  SummarizeInferenceFormV2,
  Text2TextGenerationFormV2,
  TextClassificationFormV2,
  TokenClassificationFormV2,
  AutomaticSpeechRecognitionFormV2,
  TextGenerationFormV2,
} from "./InferenceFormV2";

// Import Result Panels
import { ZeroShotClassificationResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/ZeroShotClassificationResultPanel";

// Import Inference Hooks
import { useInferenceZeroShotClassification, type ZeroShotClassificationInputParams } from "@/hooks/inference/useInferenceZeroShotClassification";
import { useInferenceSentimentAnalysis, type SentimentAnalysisInputParams } from "@/hooks/inference/useInferenceSentimentAnalysis";
import { useInferenceSummarizer, type SummarizerInputParams } from "@/hooks/inference/useInferenceSummarizer";
import { useInferenceText2Text, type Text2TextGenerationInputParams } from "@/hooks/inference/useInferenceText2Text";
import { useInferenceTextClassification, type TextClassificationInputParams } from "@/hooks/inference/useInferenceTextClassification";
import { useInferenceTokenClassification, type TokenClassificationInputParams } from "@/hooks/inference/useInferenceTokenClassification";
import { useInferenceAutomaticSpeechRecognition, type AutomaticSpeechRecognitionInputParams } from "@/hooks/inference/useInferenceAutomaticSpeechRecognition";
import { useInferenceTextGeneration, type TextGenerationInputParams } from "@/hooks/inference/useInferenceTextGeneration";

// Import Types
import type {
  ZeroShotClassificationResult,
  SentimentAnalysisResult,
  SummarizerResult,
  Text2TextGenerationResult,
  TextClassificationResult,
  TokenClassificationResult,
  AutomaticSpeechRecognitionResult,
  TextGenerationResult,
} from "@/schema/model";
import type { ModelParams } from "@/constants/routes";
import { ModelInformation } from "@/components/Model/ModelInformation";
import { Button } from "@/components/ui/button";

// Union type for all possible results
type InferenceResult =
  | ZeroShotClassificationResult
  | SentimentAnalysisResult
  | SummarizerResult
  | Text2TextGenerationResult
  | TextClassificationResult
  | TokenClassificationResult
  | AutomaticSpeechRecognitionResult
  | TextGenerationResult
  | undefined;

export const ModelInferenceViewV2 = () => {
  const { selectedModel } = useModels();
  const navigate = useNavigate();
  const { modelId } = useParams({ strict: false }) as ModelParams;
  const [result, setResult] = useState<InferenceResult>();
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize all inference hooks
  const zeroShotClassification = useInferenceZeroShotClassification(modelId);
  const sentimentAnalysis = useInferenceSentimentAnalysis(modelId);
  const summarizer = useInferenceSummarizer(modelId);
  const text2Text = useInferenceText2Text(modelId);
  const textClassification = useInferenceTextClassification(modelId);
  const tokenClassification = useInferenceTokenClassification(modelId);
  const speechRecognition = useInferenceAutomaticSpeechRecognition(modelId);
  const textGeneration = useInferenceTextGeneration(modelId);

  useEffect(() => {
    if (!selectedModel) {
      navigate({
        to: ROUTES.HOME,
        replace: true,
      });
    }
  }, [navigate, selectedModel]);

  // Get the current hook and isPending based on model task
  const getCurrentInferenceHook = () => {
    switch (selectedModel?.task) {
      case "zero-shot-classification":
        return { hook: zeroShotClassification, isPending: zeroShotClassification.isPending };
      case "sentiment-analysis":
        return { hook: sentimentAnalysis, isPending: sentimentAnalysis.isPending };
      case "summarization":
        return { hook: summarizer, isPending: summarizer.isPending };
      case "text2text-generation":
        return { hook: text2Text, isPending: text2Text.isPending };
      case "text-classification":
        return { hook: textClassification, isPending: textClassification.isPending };
      case "token-classification":
        return { hook: tokenClassification, isPending: tokenClassification.isPending };
      case "automatic-speech-recognition":
        return { hook: speechRecognition, isPending: speechRecognition.isPending };
      case "text-generation":
        return { hook: textGeneration, isPending: textGeneration.isPending };
      default:
        return { hook: null, isPending: false };
    }
  };

  const { hook: currentHook, isPending } = getCurrentInferenceHook();

  const handleInferenceSubmit = async (params: any) => {
    if (!currentHook || !selectedModel) return;

    try {
      let inferenceResult: InferenceResult;

      switch (selectedModel.task) {
        case "zero-shot-classification":
          inferenceResult = await zeroShotClassification.classify(params as ZeroShotClassificationInputParams);
          break;
        case "sentiment-analysis":
          inferenceResult = await sentimentAnalysis.analyze(params as SentimentAnalysisInputParams);
          break;
        case "summarization":
          inferenceResult = await summarizer.summarize(params as SummarizerInputParams);
          break;
        case "text2text-generation":
          inferenceResult = await text2Text.generate(params as Text2TextGenerationInputParams);
          break;
        case "text-classification":
          inferenceResult = await textClassification.classify(params as TextClassificationInputParams);
          break;
        case "token-classification":
          inferenceResult = await tokenClassification.classify(params as TokenClassificationInputParams);
          break;
        case "automatic-speech-recognition":
          inferenceResult = await speechRecognition.transcribe(params as AutomaticSpeechRecognitionInputParams);
          break;
        case "text-generation":
          inferenceResult = await textGeneration.generate(params as TextGenerationInputParams);
          break;
        default:
          throw new Error(`Unsupported task: ${selectedModel.task}`);
      }

      if (inferenceResult) {
        setResult(inferenceResult);
      }
    } catch (error) {
      console.error("Inference failed:", error);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!selectedModel) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  // Render the appropriate form based on model task
  const renderInferenceForm = () => {
    switch (selectedModel.task) {
      case "zero-shot-classification":
        return (
          <ZeroShotClassificationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "sentiment-analysis":
        return (
          <SentimentAnalysisFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "summarization":
        return (
          <SummarizeInferenceFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "text2text-generation":
        return (
          <Text2TextGenerationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "text-classification":
        return (
          <TextClassificationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "token-classification":
        return (
          <TokenClassificationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "automatic-speech-recognition":
        return (
          <AutomaticSpeechRecognitionFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "text-generation":
        return (
          <TextGenerationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      default:
        return (
          <div className="p-4">
            <div className="text-center text-muted-foreground">
              <p>Model task "{selectedModel.task}" is not yet supported in V2.</p>
            </div>
          </div>
        );
    }
  };

  // Render the appropriate result panel (for now, we only have zero-shot classification result panel)
  const renderResultPanel = () => {
    switch (selectedModel.task) {
      case "zero-shot-classification":
        return (
          <ZeroShotClassificationResultPanel
            result={result as ZeroShotClassificationResult}
            isPending={isPending}
          />
        );
      default:
        // For other tasks, we'll need to implement their result panels
        // For now, show a generic result display
        return result ? (
          <div className="p-4 rounded-xl border">
            <h3 className="font-semibold text-sm mb-3">Result</h3>
            <pre className="text-sm bg-muted p-3 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Model Header */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{selectedModel.name}</h1>
          <p className="text-muted-foreground text-sm">
            {selectedModel.task.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className="flex items-center gap-2"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`}
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
          <ModelInformation model={selectedModel} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 text-sm border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Status:</span>
          {selectedModel.loading ? (
            <span className="text-amber-600">Loading...</span>
          ) : selectedModel.loaded ? (
            <span className="text-green-600">Ready</span>
          ) : (
            <span className="text-muted-foreground">Not loaded</span>
          )}
        </div>

        {selectedModel.loaded && (
          <>
            <div className="text-muted-foreground">•</div>
            <div className="text-muted-foreground">Loaded in 2.3s</div>
          </>
        )}
      </div>

      {/* Inference Interface */}
      <div className="space-y-4">
        {renderInferenceForm()}
        {renderResultPanel()}
      </div>
    </div>
  );
};
