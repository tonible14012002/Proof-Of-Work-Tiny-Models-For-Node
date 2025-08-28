import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AutomaticSpeechRecognitionResult } from "@/schema/model";

interface AutomaticSpeechRecognitionResultPanelProps {
  result?: AutomaticSpeechRecognitionResult;
  isPending: boolean;
}

export const AutomaticSpeechRecognitionResultPanel = (
  props: AutomaticSpeechRecognitionResultPanelProps
) => {
  const { result, isPending } = props;

  return (
    <div className="mt-4 rounded-lg overflow-hidden">
      {isPending && (
        <Progress indeterminate className="h-[2px] rounded-b-none" />
      )}
      <div
        className={cn(
          "bg-muted p-4 break-words flex flex-col gap-1 text-sm min-h-[100px]",
          {
            "animate-pulse": isPending,
          }
        )}
      >
        {result &&
          result.data.map((item, index) => (
            <div key={index} className="space-y-2">
              <p className="font-medium text-foreground">Transcription:</p>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        {result && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Processing time: {result.latency}ms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};