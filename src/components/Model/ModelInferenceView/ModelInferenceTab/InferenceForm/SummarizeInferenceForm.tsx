import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

interface SummarizeInferenceFormProps {
  modelId: string;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
});

export const SummarizeInferenceForm = (props: SummarizeInferenceFormProps) => {
    const { onInferenceSubmit } = props
  const formInstance = useForm({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    onInferenceSubmit?.(data)
  })

  return (
    <Form {...formInstance}>
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <h3 className="font-semibold text-xs md:text-sm mb-3">Summarize Text</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="user-input"
            >
              User input
            </label>
            <FormTextArea name="input" cols={5} className="min-h-[100px] text-sm" />
          </div>
          <Button className="w-full" variant="default" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
