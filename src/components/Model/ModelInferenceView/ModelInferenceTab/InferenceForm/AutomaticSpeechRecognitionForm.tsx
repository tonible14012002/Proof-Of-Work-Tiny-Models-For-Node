import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";
import { useRef } from "react";

interface AutomaticSpeechRecognitionProps {
  modelId: string;
  onInferenceSubmit?: (data: any) => void;
}

const schema = z.object({
  audioFile: z.instanceof(File).optional(),
  audioUrl: z.string().optional(),
}).refine((data) => data.audioFile || data.audioUrl, {
  message: "Either an audio file or URL is required",
});

export const AutomaticSpeechRecognitionForm = (props: AutomaticSpeechRecognitionProps) => {
  const { onInferenceSubmit } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const formInstance = useForm({
    defaultValues: {
      audioFile: undefined,
      audioUrl: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    onInferenceSubmit?.(data);
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formInstance.setValue("audioFile", file);
      formInstance.setValue("audioUrl", "");
    }
  };

  const handlePromptSelect = (prompt: string) => {
    formInstance.setValue("audioUrl", prompt);
    formInstance.setValue("audioFile", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...formInstance}>
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">Automatic Speech Recognition</h3>
          <ExamplePromptsPopover currentTask="automatic-speech-recognition" onSelectPrompt={handlePromptSelect} />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="audio-file"
            >
              Audio File
            </label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>
          <div className="text-center text-xs text-muted-foreground">
            OR
          </div>
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="audio-url"
            >
              Audio URL
            </label>
            <Input
              {...formInstance.register("audioUrl")}
              type="url"
              placeholder="Enter audio URL..."
              className="text-sm"
              onChange={(e) => {
                formInstance.setValue("audioUrl", e.target.value);
                if (e.target.value && fileInputRef.current) {
                  formInstance.setValue("audioFile", undefined);
                  fileInputRef.current.value = "";
                }
              }}
            />
          </div>
          <Button className="w-full" variant="default" type="submit">
            Transcribe Audio
          </Button>
        </div>
      </form>
    </Form>
  );
};