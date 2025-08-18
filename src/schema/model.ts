export type ModelDetail = {
  id: string;
  name: string;
  file?: string;
  status?: string;
  progress?: number;
  loaded?: number;
  total?: number;
  task?: string;
  model?: string;
  size?: number;
  latency?: number;
  loadTime?: number;
};
