"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
}

export function Reveal({ children, width = "100%", className, delay = 0 }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ width }} className={cn("relative", className)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
