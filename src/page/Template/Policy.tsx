import { ReactNode } from "react";
import { TypeAnimation } from "react-type-animation";

import { useDesktopMediaQuery } from "@/components/custom/responsive/device";
import RingCard from "@/components/ui/ring-card";
import NavigationBar from "../Template/NavigationBar";
import FooterBar from "../Template/FooterBar";
import DottedScroller from "@/components/ui/dotted-scroller";

interface Props {
  title: string;
  children?: ReactNode;
}

function Policy({ title, children }: Props) {
  return (
    <>
      <DottedScroller />
      <NavigationBar />
      <div
        className={
          "relative min-h-screen " +
          (useDesktopMediaQuery() ? "mt-20" : "pt-[150px]")
        }
      >
        <div className="flex justify-center">
          <div
            className={
              useDesktopMediaQuery() ? "w-[50%] mx-auto" : "w-full mx-8"
            }
          >
            <div className="relative w-fit h-fit">
              <TypeAnimation
                sequence={[title + " "]}
                wrapper="span"
                speed={60}
                className="text-primary font-bold text-3xl"
              />
              <span className="absolute top-0 left-0 w-full h-full rounded-full bg-primary mix-blend-screen blur-xl opacity-20 pointer-events-none"></span>
            </div>
            <RingCard>{children}</RingCard>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
}

export default Policy;
