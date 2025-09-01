import { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  style?: CSSProperties;
  className?: string;
  triggerClassName?: string;
  hoverIconEnabled?: boolean;
  children?: ReactNode;
  src?: string;
  alt?: string;
  delayDuration?: number;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}

function HoverableImage({
  style,
  className,
  triggerClassName,
  hoverIconEnabled,
  children,
  alt,
  src,
  delayDuration = 0,
  side = "bottom",
  sideOffset,
  align,
  alignOffset,
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger
          className={cn(
            hoverIconEnabled ? "" : "cursor-default",
            triggerClassName
          )}
        >
          <img src={src} alt={alt} style={style} className={className}></img>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default HoverableImage;
