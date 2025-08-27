import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import { EXAMPLE_PROMPTS, type TaskWithExamples } from "@/constants/model";
import { toast } from "sonner";

interface ExamplePromptsListProps {
  currentTask?: TaskWithExamples;
}

export const ExamplePromptsList = ({ currentTask }: ExamplePromptsListProps) => {
  const [copiedIndex, setCopiedIndex] = useState<{ task: string; index: number } | null>(null);

  const handleCopy = async (text: string, task: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex({ task, index });
      toast.success("Prompt copied to clipboard");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err: any) {
      toast.error("Failed to copy prompt", {
        description: err?.message
      });
    }
  };

  const taskLabels: Record<TaskWithExamples, string> = {
    "summarization": "Summarization",
    "sentiment-analysis": "Sentiment Analysis",
    "zero-shot-classification": "Zero-Shot Classification",
    "token-classification": "Token Classification",
    "text-classification": "Text Classification"
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={currentTask || "summarization"} className="w-full">
        <ScrollArea className="overflow-x-auto">
          <TabsList className="max-w-full">
            {Object.entries(taskLabels).map(([task, label]) => (
              <TabsTrigger key={task} value={task} className="text-xs">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {Object.entries(EXAMPLE_PROMPTS).map(([task, prompts]) => (
          <TabsContent key={task} value={task} className="mt-2">
            <ScrollArea className="h-[300px] w-full rounded-md">
              <div className="space-y-3 shadow-md">
                {prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm flex-1 leading-relaxed">{prompt}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(prompt, task, index)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      {copiedIndex?.task === task && copiedIndex?.index === index ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
