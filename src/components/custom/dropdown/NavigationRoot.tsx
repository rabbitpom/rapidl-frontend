/* Import React components and 3rd party libraries */
import { useState, ReactNode, RefObject } from "react";
/* Import custom components */
import { NavigationRootContext } from "./NavigationRootContext";

interface Props {
  children?: ReactNode;
}

function NavigationRoot({ children }: Props) {
  const [ownedElement, setOwnedElement] =
    useState<RefObject<HTMLButtonElement> | null>(null);
  const [renderedChild, setRenderedChild] = useState<ReactNode | null>(null);
  const [optionalIsVisible, setOptionalIsVisible] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  function updateRenderedChild(toRenderChild: ReactNode | null) {
    setRenderedChild(toRenderChild);
  }
  function updateOwnedElement(
    toOwnedElement: RefObject<HTMLButtonElement> | null
  ) {
    setOwnedElement(toOwnedElement);
  }
  function updateIsVisible(isVisible: boolean) {
    setOptionalIsVisible(isVisible);
    if (!isVisible) {
      setFocused(false);
    }
  }
  function updateFocused(isFocused: boolean) {
    setFocused(isFocused);
  }
  return (
    <>
      <NavigationRootContext.Provider
        value={{
          ownedElement: ownedElement,
          renderedChild: renderedChild,
          setRenderedChild: updateRenderedChild,
          setOwnedElement: updateOwnedElement,
          isVisible: optionalIsVisible,
          setVisible: updateIsVisible,
          focused: focused,
          setFocused: updateFocused,
        }}
      >
        {children}
      </NavigationRootContext.Provider>
    </>
  );
}

export default NavigationRoot;
