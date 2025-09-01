import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";

import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";
import { RootState } from "@/store/configure-store";
import DottedScroller from "@/components/ui/dotted-scroller";
import Block from "@/components/custom/navigation/block";
import NavigationBar from "./Template/NavigationBar";
import FooterBar from "./Template/FooterBar";

function Home() {
  const NoSessionDesktopContent = lazy(
    () => import("./HomeContent/NoSessionDesktopContent")
  );
  const DesktopContent = lazy(() => import("./HomeContent/DesktopContent"));
  const MobileContent = lazy(() => import("./HomeContent/MobileContent"));
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );

  return (
    <>
      <DottedScroller />
      <NavigationBar />
      <Desktop>
        {sessionEnded ? (
          <Suspense fallback={<Block />}>
            <NoSessionDesktopContent />
          </Suspense>
        ) : (
          <Suspense fallback={<Block />}>
            <DesktopContent />
          </Suspense>
        )}
      </Desktop>
      <TabletAndBelow>
        {sessionEnded ? (
          <Block />
        ) : (
          <Suspense fallback={<Block />}>
            <MobileContent />
          </Suspense>
        )}
      </TabletAndBelow>
      <FooterBar />
    </>
  );
}

export default Home;
