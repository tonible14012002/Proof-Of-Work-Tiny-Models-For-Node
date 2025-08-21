import { createContext } from "@/lib/utils";
import type { ModelDetail } from "@/schema/model";
import { useState, type PropsWithChildren } from "react";
import { DEFAULT_MODELS } from "./constant";

interface ModelContextValues {
  mutateList: (id: string, data: ModelDetail) => void;
  models: ModelDetail[];
}

const [Provider, useModels] = createContext<ModelContextValues>();

export { useModels };

export const ModelsProvider = ({ children }: PropsWithChildren) => {
  const [models, setModels] = useState<ModelDetail[]>(DEFAULT_MODELS);

  const mutateList = (id: string, data: ModelDetail) => {
    setModels((prevModels) =>
      prevModels.map((model) => (model.id === id ? data : model))
    );
  };

  return <Provider value={{ mutateList, models }}>{children}</Provider>;
};
