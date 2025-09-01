import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  children?: ReactNode;
  className?: string;
}

function Title({ children, className }: Props) {
  return (
    <h1
      className={cn(
        "t text-white dark:text-black underline decoration-primary decoration-4 font-semibold",
        className
      )}
    >
      {children}
    </h1>
  );
}

export default Title;
