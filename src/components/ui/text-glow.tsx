import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  glowClassName?: string;
  textClassName?: string;
  className?: string;
  children?: ReactNode;
}

function Glow({ children, textClassName, glowClassName, className }: Props) {
  return (
    <span className={cn("relative w-fit h-fit inline", className)}>
      <span className={textClassName}>{children}</span>
      <span
        className={cn(
          "absolute top-0 left-0 w-full h-full rounded-full mix-blend-screen blur-md opacity-20 pointer-events-none",
          glowClassName
        )}
      ></span>
    </span>
  );
}

export default Glow;
