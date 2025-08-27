import {
  useInferenceSummarizer,
  type SummarizerInputParams,
} from "@/hooks/inference/useInferenceSummarizer";
import type { ModelDetail } from "@/schema/model";
import { SummarizeInferenceForm } from "./InferenceForm/SummarizeInferenceForm";
import { SummarizeResultPanel } from "./ResultPanel";
import { useState } from "react";
import { SentimentAnalysisForm } from "./InferenceForm/SentimentAnalysisForm";
import {
  useInferenceSentimentAnalysis,
  type SentimentAnalysisInputParams,
} from "@/hooks/inference/useInferenceSentimentAnalysis";
import { SentimentAnalysisResultPanel } from "./ResultPanel/SentimentAnalysisResultPanel";
import { Badge } from "@/components/ui/badge";
import { formatReadableDurationInMs } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Text2TextGenerationForm } from "./InferenceForm/Text2TextGenerationForm";
import { useInferenceText2Text } from "@/hooks/inference/useInferenceText2Text";
import { Text2TextResultPanel } from "./ResultPanel/Text2TextResultPanel";
import { ZeroShotClassificationForm } from "./InferenceForm/ZeroShotClassificationForm";
import {
  useInferenceZeroShotClassification,
  type ZeroShotClassificationInputParams,
} from "@/hooks/inference/useInferenceZeroShotClassification";
import { ZeroShotClassificationResultPanel } from "./ResultPanel/ZeroShotClassificationResultPanel";
import { TokenClassificationForm } from "./InferenceForm/TokenClassificationForm";
import {
  useInferenceTokenClassification,
  type TokenClassificationInputParams,
} from "@/hooks/inference/useInferenceTokenClassification";
import { TokenClassificationResultPanel } from "./ResultPanel/TokenClassificationResultPanel";
import { TextClassificationForm } from "./InferenceForm/TextClassificationForm";
import {
  useInferenceTextClassification,
  type TextClassificationInputParams,
} from "@/hooks/inference/useInferenceTextClassification";
import { TextClassificationResultPanel } from "./ResultPanel/TextClassificationResultPanel";

interface ModelInferenceTabProps {
  model: ModelDetail;
}

export const ModelInferenceTab = (props: ModelInferenceTabProps) => {
  const { model } = props;
  const { summarize, isPending: isPendingSummarize } = useInferenceSummarizer(
    model.id
  );
  const { analyze, isPending: isPendingAnalyze } =
    useInferenceSentimentAnalysis(model.id);

  const { generate, isPending: isPendingGenerate } = useInferenceText2Text(
    model.id
  );

  const { classify, isPending: isPendingClassify } = useInferenceZeroShotClassification(
    model.id
  );

  const { classify: classifyTokens, isPending: isPendingTokenClassify } = useInferenceTokenClassification(
    model.id
  );

  const { classify: classifyText, isPending: isPendingTextClassify } = useInferenceTextClassification(
    model.id
  );

  const [result, setResult] = useState<any>(null);

  const onInference = async (data: any) => {
    switch (model.task) {
      case "summarization":
        {
          setResult(null);
          const result = await summarize({
            text: data.input,
          } as SummarizerInputParams);

          setResult(result);
        }
        break;

      case "sentiment-analysis":
        {
          setResult(null);
          const result = await analyze({
            text: data.input,
            options: {
              top_k: data.topK === "null" ? null : Number(data.topK),
            },
          } as SentimentAnalysisInputParams);
          setResult(result);
        }
        break;
      case "text2text-generation":
        {
          setResult(null);
          const result = await generate({
            text: data.input,
            options:
              data.max_new_tokens && !isNaN(Number(data.max_new_tokens))
                ? {
                    max_new_tokens: Number(data.max_new_tokens),
                  }
                : undefined,
          });
          setResult(result);
        }
        break;
      case "zero-shot-classification":
        {
          setResult(null);
          const result = await classify({
            text: data.text,
            labels: data.labels,
            template: data.template
          } as ZeroShotClassificationInputParams);
          setResult(result);
        }
        break;
      case "token-classification":
        {
          setResult(null);
          const result = await classifyTokens({
            text: data.text,
            options: data.options,
          } as TokenClassificationInputParams);
          setResult(result);
        }
        break;
      case "text-classification":
        {
          setResult(null);
          const result = await classifyText({
            text: data.input,
            options: {
              top_k: data.topK === "null" ? null : Number(data.topK),
            },
          } as TextClassificationInputParams);
          setResult(result);
        }
        break;
    }
  };

  const isPending = isPendingSummarize || isPendingAnalyze || isPendingGenerate || isPendingClassify || isPendingTokenClassify || isPendingTextClassify;

  return (
    <>
      {getInferenceForm({
        model,
        onInferenceSubmit: onInference,
      })}
      <div className="rounded-lg space-y-2 p-4 mt-4 border">
        <h3 className="font-medium">Inference Result</h3>
        {result && result.latency && (
          <div className="">
            <Badge>Latency: {formatReadableDurationInMs(result.latency)}</Badge>
          </div>
        )}
        {isPending && (
          <div className="">
            <Skeleton className="h-[22px] w-[40px]" />
          </div>
        )}
        {getInferenceResultPanel({
          model,
          isPending,
          result,
        })}
      </div>
    </>
  );
};

type GetInferenceFormParams = {
  model: ModelDetail;
  onInferenceSubmit?: (_: any) => void;
};

const getInferenceForm = ({
  model,
  onInferenceSubmit,
}: GetInferenceFormParams) => {
  let Form: any = null;
  switch (model.task) {
    case "summarization":
      Form = SummarizeInferenceForm;
      break;
    case "sentiment-analysis":
      Form = SentimentAnalysisForm;
      break;
    case "text2text-generation":
      Form = Text2TextGenerationForm;
      break;
    case "zero-shot-classification":
      Form = ZeroShotClassificationForm;
      break;
    case "token-classification":
      Form = TokenClassificationForm;
      break;
    case "text-classification":
      Form = TextClassificationForm;
      break;
  }

  if (!Form) {
    return null;
  }
  return <Form onInferenceSubmit={onInferenceSubmit} modelId={model.id} />;
};

type GetInferenceResultPanelParams = {
  model: ModelDetail;
  isPending: boolean;
  result: any;
};

const getInferenceResultPanel = ({
  model,
  isPending,
  result,
}: GetInferenceResultPanelParams) => {
  let PanelComp: any = null;
  switch (model.task) {
    case "summarization":
      PanelComp = SummarizeResultPanel;
      break;
    case "sentiment-analysis":
      PanelComp = SentimentAnalysisResultPanel;
      break;
    case "text2text-generation":
      PanelComp = Text2TextResultPanel;
      break;
    case "zero-shot-classification":
      PanelComp = ZeroShotClassificationResultPanel;
      break;
    case "token-classification":
      PanelComp = TokenClassificationResultPanel;
      break;
    case "text-classification":
      PanelComp = TextClassificationResultPanel;
      break;
  }

  if (!PanelComp) {
    return null;
  }

  return <PanelComp isPending={isPending} result={result} />;
};
