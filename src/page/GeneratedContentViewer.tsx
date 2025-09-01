import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";

import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";
import { RootState } from "@/store/configure-store";
import DottedScroller from "@/components/ui/dotted-scroller";
import Loading1 from "./Preloader/Loading1";

function GeneratedContentViewer() {
  const DesktopContent = lazy(
    () => import("./GeneratedContentViewerContent/DesktopContent")
  );
  const MobileContent = lazy(
    () => import("./GeneratedContentViewerContent/MobileContent")
  );
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );

  return (
    <>
      <DottedScroller />
      <MathJaxContext>
        <Desktop>
          {sessionEnded ? (
            <Navigate to="/auth" replace />
          ) : (
            <Suspense fallback={<Loading1 />}>
              <DesktopContent />
            </Suspense>
          )}
        </Desktop>
        <TabletAndBelow>
          {sessionEnded ? (
            <Navigate to="/auth" replace />
          ) : (
            <Suspense fallback={<Loading1 />}>
              <MobileContent />
            </Suspense>
          )}
        </TabletAndBelow>
      </MathJaxContext>
    </>
  );
}

export default GeneratedContentViewer;
