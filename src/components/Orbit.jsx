"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * Responsive Orbit component
 *
 * radius can be:
 * - "50%" or 120 (as before)
 * - { base: "40%", md: "35%", lg: 120 }  // responsive values
 *
 * Breakpoints used: base (0), sm (640), md (768), lg (1024), xl (1280), 2xl (1536)
 */
const Orbit = ({
  planetCount = 6,
  radius = "50%", // string | number | object (responsive)
  duration = 30000,
  className = "w-full",
  planetClassName = "",
  ringClassName = "border border-gray-300/20 lg:border-gray-300/30",
  style = {},
}) => {
  const orbitRef = useRef(null);
  const ringRef = useRef(null);
  const tlRef = useRef(null);
  const observerRef = useRef(null);

  // Tailwind-like breakpoint mins (descending order to pick largest matching)
  const BREAKPOINTS = [
    { key: "2xl", min: 1536 },
    { key: "xl", min: 1280 },
    { key: "lg", min: 1024 },
    { key: "md", min: 768 },
    { key: "sm", min: 640 },
    { key: "base", min: 0 },
  ];

  // pick the responsive radius value (if radius is an object)
  const pickResponsiveRadiusValue = useCallback(
    (radiusProp, viewportWidth) => {
      if (!radiusProp || typeof radiusProp !== "object") return radiusProp;
      // return the first defined value where viewportWidth >= breakpoint.min
      for (let i = 0; i < BREAKPOINTS.length; i++) {
        const { key, min } = BREAKPOINTS[i];
        if (viewportWidth >= min && radiusProp[key] !== undefined) {
          return radiusProp[key];
        }
      }
      // fallback to base or any available value
      return radiusProp.base ?? Object.values(radiusProp)[0];
    },
    []
  );

  // parse a single radius value into pixels (if percent, need orbitWidth)
  const parseRadiusValue = useCallback((value, orbitWidth) => {
    if (value == null || value === "") return 0;
    if (typeof value === "string" && value.includes("%")) {
      const pct = parseFloat(value) / 100 || 0;
      return orbitWidth * pct;
    }
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : 0;
  }, []);

  // calculate the radius IN PIXELS based on current viewport and orbit width
  const calculateRadius = useCallback(() => {
    const orbit = orbitRef.current;
    if (!orbit) return 0;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;

    // pick radius value according to responsive rules
    const selected = pickResponsiveRadiusValue(radius, viewportWidth);

    // if selected is a percent string we need orbit.offsetWidth as base
    const orbitWidth = orbit.offsetWidth || 0;
    const radiusInPixels = parseRadiusValue(selected, orbitWidth);
    return radiusInPixels;
  }, [radius, pickResponsiveRadiusValue, parseRadiusValue]);

  // set ring size to 2 * radius and center it
  const updateRingSize = useCallback(() => {
    const ring = ringRef.current;
    const orbit = orbitRef.current;
    if (!ring || !orbit) return;
    const r = calculateRadius();
    const diameter = r * 2;
    ring.style.width = `${diameter}px`;
    ring.style.height = `${diameter}px`;
    ring.style.position = "absolute";
    ring.style.top = "50%";
    ring.style.left = "50%";
    ring.style.transform = "translate(-50%, -50%)";
    ring.style.pointerEvents = "none";
  }, [calculateRadius]);

  // position planets on the ring according to progress (0..1)
  const updatePlanetPositions = useCallback(
    (progress = 0) => {
      const orbit = orbitRef.current;
      if (!orbit) return;
      const radiusInPixels = calculateRadius();
      const children = orbit.querySelectorAll(".orbit__planet");
      children.forEach((planet, idx) => {
        const angle = (idx * 360) / planetCount + progress * 360;
        const x = radiusInPixels * Math.cos((angle * Math.PI) / 180);
        const y = radiusInPixels * Math.sin((angle * Math.PI) / 180);
        planet.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      });
    },
    [calculateRadius, planetCount]
  );

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    // initial sizing/positioning
    updateRingSize();
    updatePlanetPositions(0);

    // cleanup old timeline if any
    if (tlRef.current) {

        tlRef.current.kill();

      tlRef.current = null;
    }

    // animate numeric progress (preferred to avoid rotating container/layout changes)
    const state = { progress: 0 };
    tlRef.current = gsap.timeline({ repeat: -1 });
    tlRef.current.to(state, {
      progress: 1,
      duration: duration / 1000,
      ease: "linear",
      onUpdate: function () {
        updatePlanetPositions(state.progress);
      },
    });

    // intersection observer play/pause
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(() => {
          tlRef.current?.play();
        });
      },
      { threshold: 0 }
    );
    observerRef.current.observe(orbit);

    // handle resize (viewport changes -> breakpoint may change)
    const handleResize = () => {
      updateRingSize();
      updatePlanetPositions(0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observerRef.current && orbit) observerRef.current.unobserve(orbit);
      if (tlRef.current) {
       
          tlRef.current.kill();
       
        tlRef.current = null;
      }
      observerRef.current = null;
    };
    // re-run when duration/planetCount/radius logic changes
  }, [duration, planetCount, updatePlanetPositions, updateRingSize, radius]);

  // render planets
  const planets = Array.from({ length: planetCount }).map((_, i) => (
    <span
      key={i}
      className={`orbit__planet absolute top-1/2 left-1/2 w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full border border-cyan-300 bg-cyan-500/60 shadow-md pointer-events-none will-change-[transform] ${planetClassName}`}
      aria-hidden
      style={{
        transform: "translate(-50%, -50%)",
      }}
    />
  ));

  return (
    <div
      ref={orbitRef}
      className={`orbit relative overflow-visible origin-center ${className}`}
      style={{ ...style }}
    >
      {/* orbit ring (border circle) */}
      <div ref={ringRef} className={`orbit-ring rounded-full ${ringClassName}`} aria-hidden />
      {planets}
    </div>
  );
};

export default Orbit;
