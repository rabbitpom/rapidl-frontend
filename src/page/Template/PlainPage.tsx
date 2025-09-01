import { ReactNode } from "react";

import { useDesktopMediaQuery } from "@/components/custom/responsive/device";
import RingCard from "@/components/ui/ring-card";
import NavigationBar from "../Template/NavigationBar";
import FooterBar from "../Template/FooterBar";
import DottedScroller from "@/components/ui/dotted-scroller";

interface Props {
  children?: ReactNode;
  desktopOuterClassName?: string;
  desktopInnerClassName?: string;
  mobileOuterClassName?: string;
  mobileInnerClassName?: string;
}

function PlainPage({
  children,
  desktopOuterClassName = "mt-20",
  desktopInnerClassName = "w-[50%] mx-auto",
  mobileOuterClassName = "pt-[150px]",
  mobileInnerClassName = "w-full mx-8",
}: Props) {
  return (
    <>
      <DottedScroller />
      <NavigationBar />
      <div
        className={
          "relative min-h-screen " +
          (useDesktopMediaQuery()
            ? desktopOuterClassName
            : mobileOuterClassName)
        }
      >
        <div className="flex justify-center">
          <div
            className={
              useDesktopMediaQuery()
                ? desktopInnerClassName
                : mobileInnerClassName
            }
          >
            <RingCard>{children}</RingCard>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
}

export default PlainPage;
