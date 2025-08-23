import { FormInput } from "@/components/common/Form/FormInput";
import { FormSelection } from "@/components/common/Form/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export interface ModelAddPopupProps {
  trigger?: ReactNode;
}

const schema = z.object({
  name: z.string().min(1, "Model name is required"),
  modelPath: z.string().min(1, "Model path is required"),
  task: z.enum(["text-classification", "zero-shot-classification"]),
});

type FormSchema = z.infer<typeof schema>;

export const ModelAddPopup = (props: ModelAddPopupProps) => {
  const { trigger } = props;

  const formInstance = useForm<FormSchema>({
    defaultValues: {
      name: "",
      modelPath: "",
      task: "text-classification",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    console.log({ data });
  });

  return (
    <Dialog>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <Form {...formInstance}>
        <DialogContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <DialogTitle>Add Model From Hugging Face</DialogTitle>
            <div className="flex flex-col gap-2">
              <FormInput name="name" label="Model Name" />
              <FormSelection
                label="Task"
                name="task"
                options={[
                  {
                    label: "Text Classification",
                    value: "text-classification",
                  },
                  {
                    label: "Zero-Shot Classification",
                    value: "zero-shot-classification",
                  },
                ]}
              />
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
