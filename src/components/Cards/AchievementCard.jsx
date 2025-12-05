"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function AchievementCard({
  count,
  title,
  className = "",
  duration = 1, // seconds (GSAP expects seconds)
  startOnView = true,
}) {
  const rootRef = useRef(null);
  const tweenRef = useRef(null);
  const ranOnceRef = useRef(false);
  const valueRef = useRef({ value: 0 });
  const [display, setDisplay] = useState(0);
  const ioRef = useRef(null);

  const start = () => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;

    // kill previous tween if any
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    // GSAP tween the numeric value; onUpdate pushes to state
    tweenRef.current = gsap.to(valueRef.current, {
      value: Number(count) || 0,
      duration: duration,
      ease: "power3.out",
      onUpdate: () => {
        // floor for integer display, you may change to Math.round or show decimals
        setDisplay(Math.floor(valueRef.current.value));
      },
      onComplete: () => {
        setDisplay(Number(count) || 0);
      },
    });
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    if (startOnView && typeof IntersectionObserver !== "undefined") {
      ioRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              start();
              if (ioRef.current && node) ioRef.current.unobserve(node);
            }
          });
        },
        { threshold: 0.3 }
      );
      ioRef.current.observe(node);
    } else {
      start();
    }

    return () => {
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
    // intentionally not including `count` in deps to avoid re-triggering; change if you want re-anim on count change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnView, duration]);

  return (
    <div ref={rootRef} className={`group flex flex-col items-center ${className}`}>
      {/* Top Line */}
      <div className="flex flex-row h-8 w-3xs group-hover:opacity-0 transition-all border-l border-r border-primary-border" />

      <div className="flex flex-row">
        {/* Left Line */}
        <div className="flex flex-row h-auto w-5 group-hover:opacity-0  transition-all  border-t border-b border-primary-border" />

        {/* Main Content */}
        <div className="block text-center w-3xs px-5 py-7 text-light border bg-primary-card border-primary-border hover:border-primary transition-all">
          <div className="font-bold text-4xl md:text-5xl mb-5">
            {display.toLocaleString()}+
          </div>
          <div className="uppercase text-sm md:text-md text-primary-light font-semibold">
            {title}
          </div>
        </div>

        {/* Right Line */}
        <div className="flex flex-row h-auto w-5 group-hover:opacity-0 transition-all border-t border-b border-primary-border" />
      </div>

      {/* Bottom Line */}
      <div className="flex flex-row h-8 w-3xs group-hover:opacity-0 transition-opacity border-l border-r border-primary-border" />
    </div>
  );
}
