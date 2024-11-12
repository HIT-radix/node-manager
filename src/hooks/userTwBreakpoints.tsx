"use client";

import { useEffect, useState, useMemo } from "react";

export enum TwBreakPoints {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
}

const tailwindBreakpoints: Record<TwBreakPoints, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useTwBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState<TwBreakPoints>();

  useEffect(() => {
    const breakpointNames = Object.keys(tailwindBreakpoints);
    const breakpointValues = Object.values(tailwindBreakpoints);

    const findBreakpoint = (width: number) => {
      let computedBreakpoint = TwBreakPoints.xs;
      for (let i = 0; i < breakpointNames.length; i++) {
        if (width >= breakpointValues[i]) {
          computedBreakpoint = breakpointNames[i] as TwBreakPoints;
        } else {
          break;
        }
      }
      return computedBreakpoint;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      setBreakpoint(findBreakpoint(width));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return useMemo(() => breakpoint, [breakpoint]);
};
