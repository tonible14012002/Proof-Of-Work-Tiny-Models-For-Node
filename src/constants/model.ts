export const DTYPE_OPTIONS = [
  { value: "auto", label: "auto" },
  { value: "bnb4", label: "bnb4" },
  { value: "fp16", label: "fp16" },
  { value: "fp32", label: "fp32" },
  { value: "int8", label: "int8" },
  { value: "q4", label: "q4" },
  { value: "q4f16", label: "q4f16" },
  { value: "q8", label: "q8" },
  { value: "uint8", label: "uint8" },
] as const;

export type DType = (typeof DTYPE_OPTIONS)[number]["value"];


