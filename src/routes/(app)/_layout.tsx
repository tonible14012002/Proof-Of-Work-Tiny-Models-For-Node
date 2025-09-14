import { AppHeader } from "@/components/common/AppHeader";
import { AppLayout } from "@/components/common/AppLayout";
import { AppSidebarV2 } from "@/components/common/AppSidebarV2";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout sidebar={<AppSidebarV2 />} header={<AppHeader />}>
      <Outlet />
    </AppLayout>
  );
}
