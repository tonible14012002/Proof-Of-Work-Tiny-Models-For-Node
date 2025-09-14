import { AppProviderV2 } from "@/provider/AppProviderV2";
import type { PropsWithChildren } from "react";

interface AppLayoutProps extends PropsWithChildren {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const AppLayout = ({ header, sidebar, children }: AppLayoutProps) => {
  return (
    <AppProviderV2>
      <div className="w-full h-[100dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 w-full bg-white border-b">{header}</div>
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {sidebar}
          <div className="flex-1 min-w-0 min-h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </AppProviderV2>
  );
};
