// src/components/ScrollRotatorButton.jsx
import React, { useEffect, useRef, useState } from "react";
import { IMAGE_ASSETS } from "../constants/ImageContants";
// Import the SVG here so MainLayout doesn't need to pass it.
// Adjust the path if your assets are located elsewhere.

export default function ScrollRotatorButton({
  size = "w-15 h-15",
  bottom = "bottom-8",
  right = "right-6",
}) {
  const [angle, setAngle] = useState(0); // current rotation angle (deg)
  const [percent, setPercent] = useState(0); // scroll percent (0-100)
  const [visible, setVisible] = useState(false);

  const prevScrollRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const latestScrollRef = useRef(prevScrollRef.current);
  const tickingRef = useRef(false);
  const angleRef = useRef(0);

  // Tweak behavior here:
  const ROTATION_FACTOR = 0.6; // degrees per pixel scrolled
  const SHOW_AFTER_PX = 60; // show button after scrolling this many px

  useEffect(() => {
    function updateFromScroll() {
      const current = latestScrollRef.current;
      const prev = prevScrollRef.current;
      const delta = current - prev;

      // accumulate rotation based on scroll delta
      angleRef.current += delta * ROTATION_FACTOR;
      setAngle(angleRef.current);

      // calculate scroll percentage
      const doc = document.documentElement;
      const scrollHeight = Math.max(doc.scrollHeight, document.body.scrollHeight, doc.clientHeight);
      const winH = window.innerHeight || doc.clientHeight;
      const maxScrollable = Math.max(1, scrollHeight - winH);
      const pct = Math.min(100, Math.max(0, Math.round((current / maxScrollable) * 100)));
      setPercent(pct);

      // control visibility
      setVisible(current > SHOW_AFTER_PX);

      // prepare for next tick
      prevScrollRef.current = current;
      tickingRef.current = false;
    }

    function onScroll() {
      latestScrollRef.current = window.scrollY || window.pageYOffset;
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(updateFromScroll);
      }
    }

    // initial values
    latestScrollRef.current = window.scrollY || window.pageYOffset;
    prevScrollRef.current = latestScrollRef.current;
    // set initial percent & visibility
    (function initPercentAndVisibility() {
      const doc = document.documentElement;
      const scrollHeight = Math.max(doc.scrollHeight, document.body.scrollHeight, doc.clientHeight);
      const winH = window.innerHeight || doc.clientHeight;
      const maxScrollable = Math.max(1, scrollHeight - winH);
      const pct = Math.min(100, Math.max(0, Math.round((latestScrollRef.current / maxScrollable) * 100)));
      setPercent(pct);
      setVisible(latestScrollRef.current > SHOW_AFTER_PX);
    })();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.lenis.scrollTo(0);
  }

  // Rotate the wrapper; counter-rotate the percent label so it stays upright
  const wrapperStyle = {
    transform: `rotate(${angle}deg)`,
    transformOrigin: "center",
    transition: "transform 200ms ease",
    willChange: "transform"
  };
  const labelStyle = {
    transform: `rotate(${-angle}deg)`,
    transition: "transform 200ms ease"
  };

  if (!visible) return null;

  return (
    <div
      aria-label="Scroll to top"
      onClick={handleClick}
      className={`fixed ${bottom} ${right} z-40 cursor-pointer`}
    >
      <span
        className={`relative inline-block ${size} rounded-full flex items-center justify-center shadow-lg overflow-hidden`}
        style={wrapperStyle}
      >
        
        <div className="relative inset-0 flex items-center justify-center">
          <img
            src={IMAGE_ASSETS.SCROLL_TOP}
            alt="scroll top"
            className="w-full h-full object-contain"
           
         
          />
           <span
          className="absolute z-10  flex items-center justify-center text-[11px] font-semibold text-white"
          style={labelStyle}
        >
          {percent}%
        </span>
        </div>
      </span>
    </div>
  );
}
