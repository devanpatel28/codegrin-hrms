import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ROUTES } from "./constants/RoutesContants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Services from "./pages/Services/Services";
import Portfolio from "./pages/Portfolio/Portfolio";
import Courses from "./pages/Courses/Courses";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs/Blogs";
import ProjectDetails from "./pages/Portfolio/ProjectDetails";
import ScrollToTop from "./components/ScrollToTop";
import BlogDetails from "./pages/Blogs/BlogDetails";
import CourseDetails from "./pages/Courses/CourseDetails";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ServiceDetails from "./pages/Services/ServiceDetails";
import TermsConditions from "./pages/TermsConditions";
import FAQ from "./pages/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import usePreloader from "./hooks/usePreloader";
import Preloader from "./components/Preloader";
import AdminLogin from "./HRMS/admin/Login";


gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const isLoading = usePreloader();
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTouch: false,
    });

    window.lenis = lenis;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed",
    });

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const onRefresh = () => {
      requestAnimationFrame((t) => {
        lenis.raf(t);
        ScrollTrigger.update();
      });
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.killAll();
      lenis.destroy();
    };
  }, []);


  return (
    <>
     <Preloader isVisible={isLoading} />
      <ScrollToTop />
        <Routes>
          <Route path={ROUTES.HOME} element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path={ROUTES.SERVICES} element={<Services />} />
            <Route path={ROUTES.SERVICE_DETAILS+"/:slug"} element={<ServiceDetails />} />
            <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
            <Route path={ROUTES.PROJECT_DETAILS+"/:slug"} element={<ProjectDetails />} />
            <Route path={ROUTES.COURSES} element={<Courses />} />
            <Route path={ROUTES.COURSE_DETAILS+"/:slug"} element={<CourseDetails />} />
            <Route path={ROUTES.BLOG} element={<Blogs />} />
            <Route path={ROUTES.BLOG_DETAILS+"/:slug"} element={<BlogDetails />} />
            <Route path={ROUTES.ABOUT} element={<AboutUs />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.FAQ} element={<FAQ />} />
            <Route path={ROUTES.TERMS} element={<TermsConditions />} />
            <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
          </Route>

          <Route path={ROUTES.HRMS.ADMIN.HOME} element={<AdminLogin />}/>
          <Route path={ROUTES.HRMS.ADMIN.LOGIN} element={<AdminLogin />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  );
}
