import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../constants/RoutesContants";
import { IMAGE_ASSETS } from "../constants/ImageContants";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  // Smooth scroll handler using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep headerRef observed (no-op ResizeObserver kept)
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const ro = new ResizeObserver(() => {});
    ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  // prevent body scroll when mobile menu is open — but set overflow on next frame to reduce reflow jank
  useEffect(() => {
    let rafId = 0;
    if (open) {
      // set overflow in next frame
      rafId = requestAnimationFrame(() => {
        document.body.style.overflow = "hidden";
      });
    } else {
      // remove overflow in next frame
      rafId = requestAnimationFrame(() => {
        document.body.style.overflow = "";
      });
    }
    return () => {
      cancelAnimationFrame(rafId);
      // ensure restored
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Services", href: ROUTES.SERVICES },
    { label: "Portfolio", href: ROUTES.PORTFOLIO },
    { label: "Courses", href: ROUTES.COURSES },
    { label: "Blogs", href: ROUTES.BLOG },
    { label: "About", href: ROUTES.ABOUT },
    { label: "Contact Us", href: ROUTES.CONTACT }
  ];

  // bg + blur + shadow classes based on scroll
  const bgCls = scrolled ? "bg-black/60 backdrop-blur-sm shadow-sm" : "transparent";

  // transform classes for nav when scrolled vs not
  const navTransformCls = scrolled ? "translate-y-0" : "translate-y-2 ";

  return (
    <>
      {/* Header is overlay */}
      <nav
        ref={headerRef}
        aria-label="Primary"
        className={`fixed top-0 left-0 z-40 w-full ${bgCls} py-5 md:py-6 px-2 lg:px-0 transform transition duration-500 ease-in-out  ${navTransformCls}`}
      >
        <div className="container">
          {/* Row: left / center / right */}
          <div className="flex items-center justify-between w-full">
            {/* LEFT - Logo */}
            <div className="flex-shrink-0">
              <NavLink to={ROUTES.HOME} className="flex items-center gap-3" aria-label="Home">
                <img
                  src={IMAGE_ASSETS.LOGO}
                  alt="Company logo"
                  className={`h-10 sm:h-12 md:h-14 w-auto transform transition-transform duration-500 ease-in-out ${scrolled ? "scale-95" : "scale-100"}`}
                  loading="lazy"
                />
              </NavLink>
            </div>

            {/* CENTER - Nav (hidden on mobile) */}
            <div className="hidden xl:flex justify-center font-primary font-bold">
              {/* Added flex-nowrap so items never wrap, and each li is flex-shrink-0 */}
              <ul className="flex items-center transition-all duration-500 ease-in-out gap-6 flex-nowrap">
                {items.map((it) => (
                  <li key={it.label} className="flex-shrink-0">
                    <NavLink
                      to={it.href}
                      className={({ isActive }) =>
                        `px-3 py-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                          isActive ? "text-primary-light" : "text-white hover:text-primary"
                        }`
                      }
                    >
                      {it.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT - mobile-only toggle */}
            <div className="flex xl:hidden items-center justify-end w-24">
            <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center justify-center p-2 rounded"
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              >
                {/* Hamburger icon (when closed) */}
                {!open && (
                  <Icon icon="solar:hamburger-menu-broken" width="22" height="22" aria-hidden="true" />
                )}
               
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu (optimized) */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-0 z-50 bg-black/50 h-full backdrop-blur transition-opacity duration-250 overflow-scroll ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        onClick={() => setOpen(false)} // clicking backdrop closes menu
      >
        {/* overlay background: no expensive blur on small screens; blur allowed from md+ */}
        <div className={`absolute inset-0 ${open ? "bg-black/30" : "bg-black/0"} md:backdrop-blur-sm`} />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="fixed top-6 right-5 z-60 p-2 rounded-full"
        >
          <Icon icon="flowbite:close-outline" width="30" height="30" aria-hidden="true" />
        </button>
        {/* centered menu panel — animate with transform + opacity (GPU friendly) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ul
            className={`transform-gpu duration-300 ease-out transition-opacity ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            } w-full px-6`}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((it) => (
              <li key={it.label} className="w-full">
                <NavLink
                  to={it.href}
                  className={({ isActive }) =>
                    `block w-full text-2xl sm:text-3xl font-semibold text-center py-3 transition-colors duration-150 ${
                      isActive ? "text-primary-light" : "text-white hover:text-primary"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {it.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
