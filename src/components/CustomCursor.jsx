import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    // Detect mobile/tablet/touch devices
    const checkMobileOrTablet = () => {
      setIsMobileOrTablet(
        window.innerWidth < 1024 || // Hide on screens smaller than lg (1024px)
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkMobileOrTablet();
    window.addEventListener("resize", checkMobileOrTablet);

    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const addHover = () => setHovered(true);
    const removeHover = () => setHovered(false);

    if (!isMobileOrTablet) {
      window.addEventListener("mousemove", move);

      // Track hover on links, buttons, inputs etc.
      const hoverables = document.querySelectorAll(
        "a, button, input, textarea, [data-hover]"
      );
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });

      return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("resize", checkMobileOrTablet);
        hoverables.forEach((el) => {
          el.removeEventListener("mouseenter", addHover);
          el.removeEventListener("mouseleave", removeHover);
        });
      };
    }
  }, [isMobileOrTablet]);

  if (isMobileOrTablet) return null; // 🚀 Hide cursor on mobile and tablet

  return (
    <div
      className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999]
        transition-transform duration-500 ease-out mix-blend-difference`}
      style={{
        transform: `translate(${position.x - 15}px, ${position.y - 15}px) scale(${
          hovered ? 2.5 : 0.75
        })`,
        backgroundColor: "white",
      }}
    />
  );
}
