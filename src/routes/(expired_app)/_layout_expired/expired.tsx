import { HomePage } from "@/pages/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(expired_app)/_layout_expired/expired")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}
