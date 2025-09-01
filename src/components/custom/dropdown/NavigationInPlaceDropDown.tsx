/* Import React components and 3rd party libraries */
import { CSSProperties, ReactNode, useContext } from "react";
/* Import React components and 3rd party libraries */
import { NavigationRootContext } from "./NavigationRootContext";

interface Props {
  style?: CSSProperties;
  children?: ReactNode;
}

function NavigationInPlaceDropDown({ style, children }: Props) {
  const navigationRootContext = useContext(NavigationRootContext);

  return (
    <div
      style={style}
      className={
        "max-h-0 overflow-hidden" + navigationRootContext.isVisible
          ? " max-h-fit"
          : ""
      }
    >
      {children}
    </div>
  );
}

export default NavigationInPlaceDropDown;
