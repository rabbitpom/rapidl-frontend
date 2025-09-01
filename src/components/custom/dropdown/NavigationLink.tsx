/* Import React components and 3rd party libraries */
import { CSSProperties, ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

interface Props {
  href: string;
  caret?: boolean;
  children?: ReactNode;
  basic?: boolean;
  style?: CSSProperties;
  className?: string;
  inline?: boolean;
}

function NavigationLink({
  href,
  inline = false,
  caret = false,
  children,
  basic = false,
  style,
  className = "",
}: Props) {
  const [caretVisible, setCaretVisible] = useState(false);

  function get_body() {
    return (
      <>
        {!caretVisible ? null : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z"
              fill="hsl(var(--secondary))"
              fillRule="evenodd"
              clipRule="evenodd"
              strokeWidth="2"
              stroke="hsl(var(--secondary))"
            ></path>
          </svg>
        )}
        {caret ? (
          <Link
            to={href}
            className={cn(
              "no-underline text-white dark:text-black transition-all duration-200 ease-out hover:font-bold hover:bg-primary/90 hover:rounded-sm hover:p-1",
              className
            )}
            onMouseEnter={() => {
              setCaretVisible(true);
            }}
            onMouseLeave={() => {
              setCaretVisible(false);
            }}
          >
            {children}
          </Link>
        ) : (
          <Link
            to={href}
            className={cn(
              "no-underline text-primary transition-all duration-200 ease-out hover:font-bold hover:bg-primary/90 hover:rounded-sm hover:p-1",
              className
            )}
          >
            {children}
          </Link>
        )}
      </>
    );
  }

  return basic === true ? (
    <Link to={href} style={style} className={className}>
      {children}
    </Link>
  ) : inline ? (
    <span style={{ ...{ display: "flex", alignItems: "center" }, ...style }}>
      {get_body()}
    </span>
  ) : (
    <div style={{ ...{ display: "flex", alignItems: "center" }, ...style }}>
      {get_body()}
    </div>
  );
}

export default NavigationLink;
