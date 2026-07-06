import { useEffect, useState } from "react";

const DESKTOP_BASE = 1441;
const MOBILE_BASE = 393;
const MOBILE_BREAKPOINT = 768;

export function useDesignScale() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : DESKTOP_BASE
  );
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseWidth = width <= MOBILE_BREAKPOINT ? MOBILE_BASE : DESKTOP_BASE;
  const d = (value) => (value * width) / baseWidth;

  return { d, width, baseWidth, windowHeight };
}
