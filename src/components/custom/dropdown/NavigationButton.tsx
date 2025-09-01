import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import styles from "./NavigationButton.module.css";

import { NavigationRootContext } from "./NavigationRootContext";

interface Props {
  className?: string;
  style?: CSSProperties;
  to?: string;
  text: string;
  open?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

const NavigationButton: React.FC<Props> = ({
  className = "",
  to,
  style,
  text,
  open = false,
  children,
  onClick,
}) => {
  const NavigateTo = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigationRootContext = useContext(NavigationRootContext);

  const onMouseEnter = () => {
    if (buttonRef.current != null) {
      navigationRootContext.setOwnedElement(buttonRef);
      navigationRootContext.setRenderedChild(children);
    }
  };

  const onMouseLeave = () => {
    if (
      buttonRef.current != null &&
      navigationRootContext.ownedElement == buttonRef &&
      navigationRootContext.focused
    ) {
      navigationRootContext.setOwnedElement(null);
      navigationRootContext.setRenderedChild(null);
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.setAttribute("open", "false");
    }
  }, [open]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "open"
        ) {
          const targetElement = mutation.target as Element;
          const isOpen = targetElement.getAttribute("open") === "true";
          if (svgRef.current != null && buttonRef.current != null) {
            if (isOpen) {
              svgRef.current.classList.add(`${styles["svg-force-enable"]}`);
              buttonRef.current.classList.add(
                `${styles["navigation-button-force-enable"]}`
              );
            } else {
              svgRef.current.classList.remove(`${styles["svg-force-enable"]}`);
              buttonRef.current.classList.remove(
                `${styles["navigation-button-force-enable"]}`
              );
            }
          }
        }
      });
    });
    if (buttonRef.current) {
      observer.observe(buttonRef.current, { attributes: true });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  function internalOnClick() {
    if (to) {
      NavigateTo(to, { replace: true });
    }
    if (onClick) {
      onClick();
    }
  }

  return (
    <button
      className={cn(
        `${styles["navigation-button"]} flex items-center`,
        className
      )}
      onMouseEnter={onMouseEnter}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      onClick={internalOnClick}
      ref={buttonRef}
      style={style}
    >
      {text}
      {children == null ? null : (
        <>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{
              marginLeft: "5px",
            }}
            ref={svgRef}
          >
            <path
              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
              fillRule="evenodd"
              clipRule="evenodd"
              strokeWidth="1.25"
            ></path>
          </svg>
        </>
      )}
    </button>
  );
};

export default NavigationButton;
