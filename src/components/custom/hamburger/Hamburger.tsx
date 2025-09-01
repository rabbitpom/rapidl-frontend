import { useState, CSSProperties, Dispatch, SetStateAction } from "react";
import styles from "./Hamburger.module.css";

interface Props {
  size: string;
  strokeWidth: string;
  stroke: string;
  style?: CSSProperties;
  onClick?: (arg0: boolean) => void;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
}

function Hamburger({
  size,
  strokeWidth,
  stroke,
  style,
  onClick,
  setIsVisible,
}: Props) {
  const [active, setActive] = useState(false);

  return (
    <>
      <svg
        style={style}
        className={`${styles["ham"]} ${active ? styles["ham-active"] : ""}`}
        viewBox="0 0 100 100"
        width={size}
        onClick={() => {
          setActive(!active);
          if (setIsVisible) {
            setIsVisible(!active);
          }
          if (onClick) {
            onClick(active);
          }
        }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <path
          className={`${styles["line"]} ${styles["line-top"]} ${
            active ? styles["line-active-top"] : ""
          }`}
          style={{ stroke: stroke, strokeWidth: strokeWidth }}
          d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
        />
        <path
          className={`${styles["line"]} ${styles["line-middle"]} ${
            active ? styles["line-active-middle"] : ""
          }`}
          style={{ stroke: stroke, strokeWidth: strokeWidth }}
          d="m 30,50 h 40"
        />
        <path
          className={`${styles["line"]} ${styles["line-bottom"]} ${
            active ? styles["line-active-bottom"] : ""
          }`}
          style={{ stroke: stroke, strokeWidth: strokeWidth }}
          d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
        />
      </svg>
    </>
  );
}

export default Hamburger;
