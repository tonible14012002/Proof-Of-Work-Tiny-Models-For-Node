import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ModelDetail } from "@/schema/model";
import { useState } from "react";

interface ModelInferenceTabProps {
  model: ModelDetail;
}

export const ModelInferenceTab = (props: ModelInferenceTabProps) => {
  const { model } = props;
  const [inputValue, setInputValue] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  console.log({model})

  return (
    <>
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <h2 className="text-lg font-semibold">Inference</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="user-input"
            >
              User input
            </label>
            <Textarea
              id="user-input"
              cols={5}
              className="min-h-[100px]"
              value={inputValue}
              onChange={onChange}
            />
          </div>
          <Button className="w-full" variant="default" type="submit">
            Submit
          </Button>
        </div>
      </form>
      <div className="rounded-lg space-y-2 p-4 mt-4 border">
        <h3 className="font-medium text-lg">Inference Result</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Confidence: 0.89</Badge>
          <Badge variant="default">Latency: 420ms</Badge>
        </div>
        <div className="mt-4 bg-muted p-4 rounded-lg">
          {JSON.stringify({
            POSITIVE: true,
            SCORE: 0.95,
          })}
        </div>
      </div>
    </>
  );
};
