import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export const useDesktopMediaQuery = () =>
  useMediaQuery({ query: "(min-width: 1280px)" });

export const useTabletAndBelowMediaQuery = () =>
  useMediaQuery({ query: "(max-width: 1279px)" });

interface Props {
  children: ReactNode;
}

export function Desktop({ children }: Props) {
  const isDesktop = useDesktopMediaQuery();

  return isDesktop ? children : null;
}

export function TabletAndBelow({ children }: Props) {
  const isTabletAndBelow = useTabletAndBelowMediaQuery();

  return isTabletAndBelow ? children : null;
}
