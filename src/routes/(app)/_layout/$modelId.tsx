import { ModelInferenceViewV2 } from "@/components/Model/ModelInferenceViewV2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_layout/$modelId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ModelInferenceViewV2 />;
}
