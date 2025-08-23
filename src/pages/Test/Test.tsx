import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FeatureExtractionPipeline,
  pipeline,
  Tensor,
  type ProgressInfo,
} from "@huggingface/transformers";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";

type ModelInfo = {
  file: string;
  name: string;
  status: string;
  progress: number;
  loaded: number;
  total: number;
  task: string;
  model: string;
};

const schema = z.object({
  input: z.string().min(1, "Input cannot be empty"),
});

export const TestPage = () => {
  const [classifier, setClassifier] = useState<{
    run: FeatureExtractionPipeline
  }>();
  const [loadingInfo, setLoadingInfo] = useState<ModelInfo>({
    file: "",
    name: "",
    status: "initiate",
    progress: 0,
    loaded: 0,
    total: 0,
    task: "",
    model: "",
  });

  const [result, setResult] = useState<Tensor>();

  const formInstance = useForm({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(schema),
  });

  const onProgress = (e: ProgressInfo) => {
    setLoadingInfo((prev) => ({
      ...prev,
      ...e,
    }));
  };

  const loadClassifier = useCallback(async () => {
    const clf = await pipeline('feature-extraction', 'Xenova/sentence-t5-large', {
      progress_callback: onProgress,
    });

    setClassifier({ run: clf });
  }, []);

  const onSubmit = formInstance.handleSubmit(async ({ input }) => {
    if (loadingInfo.status !== "ready" || !classifier) return;

    console.log(classifier)
    try {
      const result = await classifier.run(input);
      setResult(result);
    }
    catch(e) {
        console.log(e)

    }
  });

  useEffect(() => {
    loadClassifier();
  }, [loadClassifier]);

  return (
    <Form {...formInstance}>
      <form
        className="w-full h-[100vh] flex items-center justify-center"
        onSubmit={onSubmit}
      >
        <div className="w-[800px] min-h-[600px] flex flex-col items-center justify-center gap-8">
          <div className="flex w-ful font-semibold">
            Classifier Status: {classifier ? "Loaded" : "Loading..."}
          </div>
          <div className="flex flex-col gap-2">
            {Object.entries(loadingInfo).map(([key, val]) => {
              return (
                <div key={key} className="flex gap-4">
                  <div className="capitalize">
                    <Badge>{key}</Badge>
                  </div>
                  <p className="bg-muted px-2 rounded-lg">{val}</p>
                </div>
              );
            })}
          </div>
          <FormField
            control={formInstance.control}
            disabled={!classifier || loadingInfo.status !== "ready"}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Run Test</Button>
          {Boolean(result) && (
            <div className="flex gap-4">
              <div>Result:</div>
              <p>{JSON.stringify(result)}</p>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};
