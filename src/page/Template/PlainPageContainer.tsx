import { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { useDesktopMediaQuery } from "@/components/custom/responsive/device";
import RingCard from "@/components/ui/ring-card";

interface Props {
  children?: ReactNode;
  ringCard?: boolean;
  fillPage?: boolean;
  className?: string;
  desktopOuterClassName?: string;
  desktopInnerClassName?: string;
  mobileOuterClassName?: string;
  mobileInnerClassName?: string;
}

function PlainPage({
  children,
  className,
  ringCard = true,
  fillPage = true,
  desktopOuterClassName = "mt-20",
  desktopInnerClassName = "w-[50%] mx-auto",
  mobileOuterClassName = "pt-[150px]",
  mobileInnerClassName = "w-full mx-8",
}: Props) {
  return (
    <>
      <div
        className={
          "relative " +
          (fillPage ? "min-h-screen " : "") +
          (useDesktopMediaQuery()
            ? desktopOuterClassName
            : mobileOuterClassName)
        }
      >
        <div className={cn("flex justify-center", className)}>
          <div
            className={
              useDesktopMediaQuery()
                ? desktopInnerClassName
                : mobileInnerClassName
            }
          >
            {ringCard ? <RingCard>{children}</RingCard> : children}
          </div>
        </div>
      </div>
    </>
  );
}

export default PlainPage;
