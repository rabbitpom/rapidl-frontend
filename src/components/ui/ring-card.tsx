import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children?: ReactNode;
}

function RingCard({ className, children }: Props) {
  return (
    <div
      className={cn(
        "ring ring-black ring-offset-border ring-offset-2 rounded-lg p-4 mt-4 bg-black/60",
        className
      )}
    >
      {children}
    </div>
  );
}

export default RingCard;
