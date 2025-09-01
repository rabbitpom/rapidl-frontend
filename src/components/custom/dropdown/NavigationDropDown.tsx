import { useContext, useRef, useEffect, useCallback, useState } from "react";

import { cn } from "@/lib/utils";

import { NavigationRootContext } from "./NavigationRootContext";

interface Props {
  rootOffsetY?: string;
  offsetY?: string;
  waitDuration?: number;
  className?: string;
}

function NavigationDropdown({
  rootOffsetY = "5rem",
  offsetY = "0px",
  waitDuration = 200,
  className,
  ...props
}: Props) {
  const adjustedRootOffsetX = useRef(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dropdownRoot = useRef<HTMLDivElement | null>(null);
  const dropdownBody = useRef<HTMLDivElement | null>(null);
  const previousButton = useRef<HTMLButtonElement | null>(null);
  const navigationRootContext = useContext(NavigationRootContext);
  const [rootOffsetX, setRootOffsetX] = useState("0px");
  const [translationX, setTranslationX] = useState(0);
  const [chevronTranslationX, setChevronTranslationX] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleDropdownPlacement = useCallback(() => {
    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    if (
      navigationRootContext.ownedElement != null &&
      navigationRootContext.ownedElement.current != null &&
      dropdownBody != null &&
      dropdownBody.current != null
    ) {
      const margin = 15;

      const buttonRect =
        navigationRootContext.ownedElement.current.getBoundingClientRect();
      const dropdownRect = dropdownBody.current.getBoundingClientRect();

      const buttonX = buttonRect.x;
      const buttonWidth = buttonRect.right - buttonRect.left;
      const buttonXMax = buttonX + buttonWidth;
      const buttonXMiddle = buttonX + buttonWidth * 0.5;

      const dropdownWidth = dropdownRect.right - dropdownRect.left;

      const anchorX = rand(
        buttonXMiddle - buttonWidth * 0.5 + margin,
        buttonXMiddle + buttonWidth * 0.5 - margin
      );
      const localMinX = buttonX - anchorX;
      const localMaxX = buttonXMax - anchorX + dropdownWidth;
      const localChevronX = (localMaxX + localMinX) * 0.5;

      setTranslationX(anchorX - dropdownWidth * 0.5);
      setChevronTranslationX(localChevronX);
    }
    if (!dropdownRoot.current) {
      return;
    }
    const rect = dropdownRoot.current.getBoundingClientRect();
    adjustedRootOffsetX.current += rect.left;
    setRootOffsetX("-" + adjustedRootOffsetX.current.toString() + "px");
  }, [navigationRootContext.ownedElement, dropdownRoot, adjustedRootOffsetX]);

  useEffect(() => {
    if (
      navigationRootContext.ownedElement != null &&
      navigationRootContext.ownedElement.current != null
    ) {
      if (visible) {
        handleDropdownPlacement();
        if (dropdownBody.current) {
          dropdownBody.current.focus();
        }
        navigationRootContext.setFocused(true);
      } else {
        const buttonRect =
          navigationRootContext.ownedElement.current.getBoundingClientRect();

        if (dropdownBody.current) {
          dropdownBody.current.style.transition = "none";
        }
        if (svgRef.current) {
          svgRef.current.style.transition = "none";
        }

        setTranslationX(buttonRect.x);
        setChevronTranslationX(0);

        if (dropdownRoot.current) {
          const rect = dropdownRoot.current.getBoundingClientRect();
          adjustedRootOffsetX.current += rect.left;
          setRootOffsetX("-" + adjustedRootOffsetX.current.toString() + "px");
        }

        setTimeout(() => {
          if (dropdownBody.current) {
            dropdownBody.current.offsetHeight; // flush
            dropdownBody.current.style.transition = "";
          }
          if (svgRef.current) {
            svgRef.current.style.transition = "";
          }
        }, 0);
      }

      const isOpen =
        navigationRootContext.ownedElement.current.getAttribute("open") ===
        "true";
      navigationRootContext.ownedElement.current.setAttribute("open", "true");

      setVisible(true);

      if (previousButton.current != null) {
        previousButton.current.setAttribute("open", "false");
        previousButton.current.onmouseenter = null;
        previousButton.current.onmouseleave = null;
        previousButton.current = null;
        if (dropdownBody.current != null) {
          dropdownBody.current.onmouseenter = null;
          dropdownBody.current.onmouseleave = null;
        }
      }

      if (!isOpen) {
        previousButton.current = navigationRootContext.ownedElement.current;

        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        function onHover() {
          if (timeoutId != null) {
            clearTimeout(timeoutId);
          }
        }
        function onUnhover() {
          timeoutId = setTimeout(() => {
            if (
              (navigationRootContext.ownedElement == null ||
                previousButton.current ===
                  navigationRootContext.ownedElement.current) &&
              previousButton.current != null
            ) {
              setVisible(false);
              navigationRootContext.setFocused(false);
              previousButton.current.setAttribute("open", "false");
              previousButton.current.onmouseenter = null;
              previousButton.current.onmouseleave = null;
              previousButton.current = null;
              if (dropdownBody.current != null) {
                dropdownBody.current.onmouseenter = null;
                dropdownBody.current.onmouseleave = null;
              }
              timeoutId = null;
              navigationRootContext.setOwnedElement(null);
              navigationRootContext.setRenderedChild(null);
            }
          }, waitDuration);
        }

        navigationRootContext.ownedElement.current.onmouseenter = onHover;
        navigationRootContext.ownedElement.current.onmouseleave = onUnhover;
        if (dropdownBody.current != null) {
          dropdownBody.current.onmouseenter = onHover;
          dropdownBody.current.onmouseleave = onUnhover;
        }
      }
    } else {
      if (
        (navigationRootContext.ownedElement == null ||
          previousButton.current ===
            navigationRootContext.ownedElement.current) &&
        previousButton.current != null
      ) {
        setVisible(false);
        navigationRootContext.setFocused(false);
        previousButton.current.setAttribute("open", "false");
        previousButton.current.onmouseenter = null;
        previousButton.current.onmouseleave = null;
        previousButton.current = null;
      }
      if (dropdownBody.current != null) {
        dropdownBody.current.onmouseenter = null;
        dropdownBody.current.onmouseleave = null;
      }
      navigationRootContext.setOwnedElement(null);
      navigationRootContext.setRenderedChild(null);
    }
  }, [navigationRootContext.ownedElement, handleDropdownPlacement]);

  useEffect(() => {
    const handleResize = () => handleDropdownPlacement;

    window.addEventListener("resize", handleResize);
    document.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("resize", handleResize);
    };
  }, [navigationRootContext.ownedElement, handleDropdownPlacement]);

  useEffect(() => {
    if (!dropdownRoot.current) {
      return;
    }
    const rect = dropdownRoot.current.getBoundingClientRect();
    adjustedRootOffsetX.current += rect.left;
    setRootOffsetX("-" + adjustedRootOffsetX.current.toString() + "px");
  }, [dropdownRoot.current]);

  useEffect(() => {
    if (dropdownBody.current && visible) {
      setTimeout(() => {
        if (dropdownBody.current && visible) {
          navigationRootContext.setFocused(true);
          dropdownBody.current.focus();
        }
      }, 0);
    }
  }, [dropdownBody.current]);

  return (
    <div
      ref={dropdownRoot}
      className="f fixed h-0 left-0 top-0"
      style={{
        display: "inherit",
        transform: `translate(${rootOffsetX},${rootOffsetY})`,
      }}
    >
      {navigationRootContext.renderedChild == null ? null : (
        <>
          <svg
            width="32"
            height="32"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="transition-all duration-200 ease-out"
            ref={svgRef}
            style={{
              zIndex: "1",
              transform: `translate(calc(${translationX}px + ${chevronTranslationX}px), calc(${offsetY} - 16px))`,
            }}
          >
            <path
              d="M4 9H11L7.5 4.5L4 9Z"
              fill="var(--drop-down-background)"
            ></path>
          </svg>
          <div
            tabIndex={-1}
            className={cn(
              "transition-all duration-200 ease-out rounded-md p-3 absolute top-0 z-50 translate-y-4 text-white dark:text-black w-max",
              className
            )}
            onBlur={(event) => {
              if (navigationRootContext.focused) {
                navigationRootContext.setFocused(false);
                if (
                  dropdownBody.current &&
                  navigationRootContext.ownedElement &&
                  navigationRootContext.ownedElement.current
                ) {
                  if (
                    event.target &&
                    !dropdownBody.current.contains(event.target)
                  ) {
                    navigationRootContext.ownedElement.current.focus();
                  }
                }
              }
            }}
            {...props}
            ref={dropdownBody}
            style={{
              // NOTE: Using translate3d(0, 0, 0) fixes the weird trails
              // left behind on Chrome
              transform: `translate(${translationX}px, ${offsetY}) translate3d(0, 0, 0)`,
              backgroundColor: "var(--drop-down-background)",
            }}
          >
            {navigationRootContext.renderedChild}
          </div>
        </>
      )}
    </div>
  );
}

export default NavigationDropdown;
