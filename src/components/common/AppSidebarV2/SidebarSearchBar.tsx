import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SidebarSearchBar = ({
  placeholder = "Search models...",
  onSearch,
  className
}: SidebarSearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-9 pl-10 pr-10 text-sm rounded-md border border-input",
            "bg-background placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-colors"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};