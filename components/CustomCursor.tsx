"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);

  // Use refs instead of state to avoid re-renders on every mouse event
  const hoveredRef = useRef(false);
  const visibleRef = useRef(false);
  const textRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const updateVisibility = () => {
      const vis = visibleRef.current && !textRef.current;
      if (dotRef.current) dotRef.current.style.opacity = vis ? "1" : "0";
      if (ringRef.current) ringRef.current.style.opacity = vis ? "1" : "0";
    };

    const updateHover = () => {
      if (!ringRef.current) return;
      const h = hoveredRef.current;
      ringRef.current.style.width = h ? "48px" : "32px";
      ringRef.current.style.height = h ? "48px" : "32px";
      ringRef.current.style.backgroundColor = h ? "rgba(201, 165, 90, 0.1)" : "rgba(201, 165, 90, 0)";
      ringRef.current.style.borderColor = h ? "rgba(201, 165, 90, 0.8)" : "rgba(201, 165, 90, 0.4)";
    };

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current && !textRef.current) {
        visibleRef.current = true;
        updateVisibility();
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.closest) return;
      
      const textElement = target.closest("input, textarea, [contenteditable]");
      if (textElement) {
        textRef.current = true;
        visibleRef.current = false;
        hoveredRef.current = false;
        updateVisibility();
        updateHover();
        return;
      } else if (textRef.current) {
        textRef.current = false;
        visibleRef.current = true;
        updateVisibility();
      }

      const isInteractive = !!target.closest(
        "a, button, select, [role='button'], [tabindex='0'], .cursor-pointer"
      );

      if (isInteractive !== hoveredRef.current) {
        hoveredRef.current = isInteractive;
        updateHover();
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      updateVisibility();
    };

    const handleMouseEnter = () => {
      if (!textRef.current) {
        visibleRef.current = true;
        updateVisibility();
      }
    };

    document.documentElement.classList.add("has-custom-cursor");

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: "var(--color-gold)",
          opacity: 0,
          transition: "opacity 0.15s ease",
        }}
      />
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          opacity: 0,
          width: 32,
          height: 32,
          border: "1px solid rgba(201, 165, 90, 0.4)",
          backgroundColor: "rgba(201, 165, 90, 0)",
          transition: "width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out, opacity 0.15s ease",
        }}
      />
    </>
  );
}
