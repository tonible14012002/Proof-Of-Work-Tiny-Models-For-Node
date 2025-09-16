import { memo } from "react";
import { AppHeaderLogo } from "./AppHeaderLogo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MenuIcon } from "lucide-react";
import { useAppSidebarContextV2 } from "../AppSidebarV2/AppSidebarProviderV2";
import { UserBadge } from "@/components/User/UserBadge";
import { UserSettingDropdown } from "@/components/User/UserSettingDropdown";

export const AppHeader = memo(() => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useAppSidebarContextV2();
  return (
    <header className="h-full flex items-center justify-between px-4">
      {/* Left side - Logo and branding text */}
      {isMobile ? (
        <Button
          size="icon"
          variant="ghost"
          className="w-fit h-fit shrink-0"
          onClick={toggleSidebar}
        >
          <MenuIcon className="!w-5 !h-5" />
        </Button>
      ) : (
        <AppHeaderLogo />
      )}

      {/* Right side - User badge */}
      <div className="flex items-center">
        <UserSettingDropdown triggerEl={<UserBadge userName="Guest User" />} />
      </div>
    </header>
  );
});

AppHeader.displayName = "AppHeader";
