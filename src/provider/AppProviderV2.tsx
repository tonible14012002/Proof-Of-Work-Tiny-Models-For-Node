import { AppSidebarProviderV2 } from "@/components/common/AppSidebarV2/AppSidebarProviderV2";
import { Toaster } from "@/components/ui/sonner";
import type { PropsWithChildren } from "react";

export const AppProviderV2 = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AppSidebarProviderV2>{children}</AppSidebarProviderV2>
      <Toaster />
    </>
  );
};
