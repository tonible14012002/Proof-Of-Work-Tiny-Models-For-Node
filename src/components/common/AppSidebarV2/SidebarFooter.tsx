import { Crown, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  className?: string;
  plan?: {
    name: string;
    type: "free" | "pro" | "enterprise";
    usage?: {
      current: number;
      limit: number;
      unit: string;
    };
  };
}

export const SidebarFooter = ({
  className,
  plan = {
    name: "Free Plan",
    type: "free",
    usage: {
      current: 15,
      limit: 100,
      unit: "models"
    }
  }
}: SidebarFooterProps) => {
  const getPlanIcon = () => {
    switch (plan.type) {
      case "pro":
        return <Crown className="h-4 w-4 text-amber-500" />;
      case "enterprise":
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPlanColor = () => {
    switch (plan.type) {
      case "pro":
        return "border-border bg-accent";
      case "enterprise":
        return "border-border bg-accent";
      default:
        return "border-border bg-accent";
    }
  };

  const usagePercentage = plan.usage ? (plan.usage.current / plan.usage.limit) * 100 : 0;

  return (
    <div className={cn("p-3 border-t", className)}>
      <div className={cn("p-3 rounded-lg border", getPlanColor())}>
        <div className="flex items-center gap-2 mb-2">
          {getPlanIcon()}
          <span className="text-sm font-medium text-foreground">
            {plan.name}
          </span>
        </div>

        {plan.usage && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{plan.usage.current} of {plan.usage.limit} {plan.usage.unit}</span>
              <span>{Math.round(usagePercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  usagePercentage > 80 ? "bg-red-500" :
                  usagePercentage > 60 ? "bg-amber-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {plan.type === "free" && (
          <button className="w-full mt-3 text-xs bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Upgrade to Pro
          </button>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          {plan.type === "free" && "Access to basic models and limited usage"}
          {plan.type === "pro" && "Unlimited models and priority support"}
          {plan.type === "enterprise" && "Custom models and dedicated support"}
        </p>
      </div>
    </div>
  );
};