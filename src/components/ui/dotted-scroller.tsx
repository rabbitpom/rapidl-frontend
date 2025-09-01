import { useEffect, useState } from "react";
import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";

interface Props {
  color?: String;
  radius?: String;
  grid_size?: String;
  falloff_size?: String;
  scrolling_x?: boolean;
  scrolling_y?: boolean;
  scroll_x_factor?: number;
  scroll_y_factor?: number;
}

function DottedScroller({
  color = "rgba(125, 125, 125, 50%)",
  radius = "1px",
  grid_size = "3rem",
  falloff_size = "1px",
  scrolling_x = false,
  scrolling_y = true,
  scroll_x_factor = 0.5,
  scroll_y_factor = 0.5,
}: Props) {
  const [windowScrollY, setWindowScrollY] = useState(0);
  const [windowScrollX, setWindowScrollX] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setWindowScrollY(scrollY);
      setWindowScrollX(scrollX);
    };
    window.addEventListener("scroll", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  return (
    <>
      <Desktop>
        <div
          style={{
            pointerEvents: "none",
            zIndex: "-1",
          }}
        >
          <div
            style={{
              zIndex: "-1",
              top: "0",
              width: "100%",
              height: "100%",
              position: "fixed",
              backgroundSize: `${grid_size} ${grid_size}`,
              backgroundImage: `radial-gradient(${color} ${radius}, transparent ${falloff_size})`,
              backgroundPositionX: scrolling_x
                ? `${windowScrollX * scroll_x_factor}px`
                : "0",
              backgroundPositionY: scrolling_y
                ? `${windowScrollY * scroll_y_factor}px`
                : "0",
              pointerEvents: "none",
            }}
          ></div>
        </div>
      </Desktop>
      <TabletAndBelow>
        <div
          style={{
            pointerEvents: "none",
            zIndex: "-1",
          }}
        >
          <div
            style={{
              zIndex: "-1",
              top: "0",
              width: "100%",
              height: "100%",
              position: "fixed",
              backgroundSize: `${grid_size} ${grid_size}`,
              backgroundImage: `radial-gradient(${color} ${radius}, transparent ${falloff_size})`,
              pointerEvents: "none",
            }}
          ></div>
        </div>
      </TabletAndBelow>
    </>
  );
}

export default DottedScroller;
