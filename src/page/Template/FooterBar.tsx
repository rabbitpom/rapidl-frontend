import { Suspense, lazy } from "react";
import { cn } from "@/lib/utils";

import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";

interface Props {
  className?: string;
}

function FooterBar({ className }: Props) {
  const DesktopFooter = lazy(
    () => import("@/components/custom/navigation/desktop-footer")
  );
  const MobileFooter = lazy(
    () => import("@/components/custom/navigation/mobile-footer")
  );

  return (
    <>
      <Desktop>
        <Suspense>
          <DesktopFooter className={cn("mt-[300px]", className)} />
        </Suspense>
      </Desktop>
      <TabletAndBelow>
        <Suspense>
          <MobileFooter className={cn("mt-[300px]", className)} />
        </Suspense>
      </TabletAndBelow>
    </>
  );
}

export default FooterBar;
