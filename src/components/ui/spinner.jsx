// components/ui/spinner.jsx - shadcn style spinner
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Spinner({ className, size = "default", ...props }) {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
      {...props}
    />
  );
}
