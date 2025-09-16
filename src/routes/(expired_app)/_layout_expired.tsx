import { AppProvider } from "@/provider/AppProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(expired_app)/_layout_expired")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}
