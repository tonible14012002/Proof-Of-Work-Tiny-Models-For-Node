import { FormInput } from "@/components/common/Form/FormInput";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { FormSelection } from "@/components/common/Form/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";
import { Plus, X } from "lucide-react";

interface TextGenerationFormProps {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const messageSchema = z.object({
  role: z.enum(["system", "user"]),
  content: z.string().min(1, "Message content is required"),
});

const schema = z.object({
  messages: z.array(messageSchema).min(1, "At least one message is required"),
  max_new_tokens: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    })
    .optional(),
  temperature: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 2),
      {
        message: "Temperature must be between 0 and 2",
      }
    ),
  top_p: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 1),
      {
        message: "Top P must be between 0 and 1",
      }
    ),
  do_sample: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

export const TextGenerationForm = (props: TextGenerationFormProps) => {
  const { onInferenceSubmit, disabled } = props;
  const formInstance = useForm({
    defaultValues: {
      messages: [{ role: "user" as const, content: "" }],
      max_new_tokens: "1024",
      temperature: "0.7",
      top_p: "0.9",
      do_sample: "true",
    },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control: formInstance.control,
    name: "messages",
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    onInferenceSubmit?.(data);
  });

  const handlePromptSelect = (prompt: string) => {
    const lastIndex = fields.length - 1;
    const currentContent = formInstance.getValues(`messages.${lastIndex}.content`);
    const newContent = currentContent ? `${currentContent}\n${prompt}` : prompt;
    formInstance.setValue(`messages.${lastIndex}.content`, newContent);
  };

  const addMessage = () => {
    append({ role: "user", content: "" });
  };

  const removeMessage = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...formInstance}>
      <form className="p-2 md:p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">Text Generation</h3>
          <ExamplePromptsPopover
            currentTask="text-generation"
            onSelectPrompt={handlePromptSelect}
          />
        </div>
        <div className="space-y-3">
          {/* Messages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs text-muted-foreground font-medium">
                Messages
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMessage}
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-2 md:p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        formInstance.watch(`messages.${index}.role`) ===
                        "system"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {formInstance.watch(`messages.${index}.role`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormSelection
                      name={`messages.${index}.role`}
                      options={[
                        { label: "System", value: "system" },
                        { label: "User", value: "user" },
                      ]}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMessage(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <FormTextArea
                  name={`messages.${index}.content`}
                  placeholder={
                    formInstance.watch(`messages.${index}.role`) === "system"
                      ? "Enter system instructions..."
                      : "Enter user message..."
                  }
                  className="text-sm min-h-[80px]"
                />
              </div>
            ))}
          </div>

          {/* Generation Parameters */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs text-muted-foreground font-medium">
                  Max new tokens
                </label>
                <FormInput
                  name="max_new_tokens"
                  type="number"
                  min={1}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-muted-foreground font-medium">
                  Enable Sampling
                </label>
                <FormSelection
                  name="do_sample"
                  options={[
                    { label: "Enabled", value: "true" },
                    { label: "Disabled", value: "false" },
                  ]}
                />
              </div>
            </div>
            
            {/* Sampling Parameters - only shown when sampling is enabled */}
            {formInstance.watch("do_sample") === "true" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <label className="block text-xs text-muted-foreground font-medium">
                    Temperature
                  </label>
                  <FormInput
                    name="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    placeholder="0.7"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-muted-foreground font-medium">
                    Top P
                  </label>
                  <FormInput
                    name="top_p"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.9"
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={disabled}>
            Generate Text
          </Button>
        </div>
      </form>
    </Form>
  );
};
