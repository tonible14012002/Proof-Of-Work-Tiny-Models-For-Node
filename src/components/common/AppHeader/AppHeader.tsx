import { memo } from "react";
import { AppHeaderLogo } from "./AppHeaderLogo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MenuIcon } from "lucide-react";
import { useAppSidebarContextV2 } from "../AppSidebarV2/AppSidebarProviderV2";

interface UserBadgeProps {
  userName: string;
  avatarUrl?: string;
}

const UserBadge = memo(({ userName, avatarUrl }: UserBadgeProps) => {
  // Generate a random avatar URL or use initials as fallback
  const getAvatarDisplay = () => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    // Generate random avatar from DiceBear or similar service
    const randomSeed = Math.random().toString(36).substring(7);
    const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;

    return (
      <img src={avatarSrc} alt={userName} className="w-6 h-6 rounded-full" />
    );
  };

  return (
    <Button
      className="flex items-center gap-2 px-3 py-1 rounded-lg"
      size="sm"
      variant="secondary"
    >
      {getAvatarDisplay()}
      <span className="text-sm font-mediu">{userName}</span>
    </Button>
  );
});

UserBadge.displayName = "UserBadge";

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
        <UserBadge userName="Guest User" />
      </div>
    </header>
  );
});

AppHeader.displayName = "AppHeader";
