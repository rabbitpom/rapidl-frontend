/* Import React components and 3rd party libraries */
import { createContext, ReactNode, Dispatch, RefObject } from "react";

interface NavigationRootContextProps {
  ownedElement: RefObject<HTMLButtonElement> | null;
  renderedChild: ReactNode | null;
  setRenderedChild: Dispatch<ReactNode | null>;
  setOwnedElement: Dispatch<RefObject<HTMLButtonElement> | null>;
  setFocused: Dispatch<boolean>;
  isVisible: boolean;
  focused: boolean;
  setVisible: Dispatch<boolean>;
}

export const NavigationRootContext = createContext<NavigationRootContextProps>({
  ownedElement: null,
  renderedChild: null,
  setRenderedChild: () => {},
  setOwnedElement: () => {},
  /* This is only respected by other components */
  focused: false,
  isVisible: false,
  setVisible: () => {},
  setFocused: () => {},
});
