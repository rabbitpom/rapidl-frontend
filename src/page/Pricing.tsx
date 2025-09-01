import { Suspense, lazy } from "react";

import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";
import DottedScroller from "@/components/ui/dotted-scroller";
import Block from "@/components/custom/navigation/block";
import NavigationBar from "./Template/NavigationBar";
import FooterBar from "./Template/FooterBar";

function Pricing() {
  const DesktopContent = lazy(() => import("./PricingContent/DesktopContent"));
  const MobileContent = lazy(() => import("./PricingContent/MobileContent"));

  return (
    <>
      <DottedScroller />
      <NavigationBar />
      <Desktop>
        <Suspense fallback={<Block />}>
          <DesktopContent />
        </Suspense>
      </Desktop>
      <TabletAndBelow>
        <Suspense fallback={<Block />}>
          <MobileContent />
        </Suspense>
      </TabletAndBelow>
      <FooterBar />
    </>
  );
}

export default Pricing;
