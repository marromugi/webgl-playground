import { useRef } from "react";
import { useThreeSetup } from "./useThreeSetup";

export const SimplexNoisePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useThreeSetup(containerRef);

  return <div ref={containerRef} />;
};