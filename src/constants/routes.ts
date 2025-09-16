type BaseParams<T> = Record<string, any> & T;

export type ModelParams = BaseParams<{
  modelId: string;
}>;

export const ROUTES = {
  HOME: "/",
  MODEL: (modelId: string) => `/${modelId}`,
};
