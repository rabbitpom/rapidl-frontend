import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";
import DesktopNavigationBar from "@/components/custom/navigation/desktop-navigation-bar";
import MobileNavigationBar from "@/components/custom/navigation/mobile-navigation-bar";

function NavigationBar() {
  return (
    <>
      <Desktop>
        <DesktopNavigationBar />
      </Desktop>
      <TabletAndBelow>
        <MobileNavigationBar />
      </TabletAndBelow>
    </>
  );
}

export default NavigationBar;
