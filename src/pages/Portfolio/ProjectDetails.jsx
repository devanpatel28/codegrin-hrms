import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";
import { portfolioAPI } from "../../utils/api";
import BorderButton from "../../components/Buttons/BorderButton";
import { Spinner } from "@/components/ui/spinner";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [nextProject, setNextProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const clipperRefs = useRef([]);
  const titleFillRef = useRef(null);
  const nextProjectRef = useRef(null);
  const nextBgRef = useRef(null);

  // 🔥 Extract header image correctly
  const getHeaderImage = (portfolio) => {
    if (!portfolio?.images?.length) return "/placeholder.webp";
    const header = portfolio.images.find((img) => img.is_header == 1);
    return header?.image_url || "/placeholder.webp";
  };

  // Fetch portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await portfolioAPI.getBySlug(slug);
        setPortfolio(response.data.portfolio);
        setNextProject(response.data.nextPortfolio || null);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPortfolio();
  }, [slug]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // GSAP Animations (only after loading)
  useEffect(() => {
    if (!portfolio || portfolio.images?.length === 0) return;

    clipperRefs.current.forEach((clip) => {
      if (!clip) return;

      gsap.fromTo(
        clip,
        { clipPath: "inset(25% round 50px)" },
        {
          clipPath: "inset(0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: clip,
            start: "top 100%",
            end: "bottom 100%",
            scrub: true,
          },
        }
      );
    });

    // Next Project Scroll Animation
    if (nextProjectRef.current && nextProject) {
      gsap.to(titleFillRef.current, {
        scrollTrigger: {
          trigger: nextProjectRef.current,
          start: "top 100%",
          end: "bottom 100%",
          scrub: true,
          onLeave: () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
            navigate(`${ROUTES.PROJECT_DETAILS}/${nextProject.slug}`);
            window.scrollTo(0, 0);
          },
        },
      });
    }

    // Parallax effect for background
    if (nextBgRef.current && nextProjectRef.current) {
      gsap.to(nextBgRef.current, {
        y: "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: nextProjectRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    ScrollTrigger.refresh();

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [portfolio, nextProject, navigate]);

  // LOADING UI (REPLACING ALL SKELETONS)
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  // ERROR OR NOT FOUND → Redirect to Portfolio listing
  if (error || !portfolio) {
    return <Navigate to={ROUTES.PORTFOLIO} replace />;
  }

  const headerImage = getHeaderImage(portfolio);

  return (
    <>
      {/* ================= HEADER SECTION ================= */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Text Overlay */}
        <div className="absolute bg-black/50 w-full h-screen z-10 flex items-center justify-center text-white font-bold text-2xl md:text-4xl lg:text-6xl xl:text-7xl">
          {portfolio.title}
        </div>

        {/* Header Image */}
        <img
          src={headerImage}
          alt={portfolio.title}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full min-h-full object-cover z-0"
          onError={(e) => (e.target.src = "/placeholder.webp")}
        />
      </div>

      {/* ================= DETAILS SECTION ================= */}
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold mb-5">PROJECT DETAILS</h1>

          <ul className="pl-2 md:pl-5 text-secondary text-lg space-y-2">
            <li>
              <strong className="text-white mr-2">Tech Category:</strong>
              {portfolio.categories?.map((c) => c.name).join(", ")}
            </li>

            <li>
              <strong className="text-white mr-2">Project Type:</strong>
              {portfolio.project_type}
            </li>

            <li>
              <strong className="text-white mr-2">Publisher:</strong>
              {portfolio.publisher_name}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-5">INFO</h1>

          {portfolio.descriptions?.map((desc, index) => (
            <p
              key={index}
              className="mb-5 pl-2 md:pl-5 text-secondary text-sm lg:text-base text-justify"
            >
              {desc}
            </p>
          ))}

          {portfolio.project_link && (
            <BorderButton
              title="Visit Link"
              target="_blank"
              link={portfolio.project_link}
              className="mt-5 ml-5"
            />
          )}
        </div>
      </div>

      {/* ================= IMAGES SECTION ================= */}
      <div className="mt-20">
        {portfolio.images?.filter((img) => img.is_header == 0).map((image, index) => (
          <div key={image.id} className="w-full relative">
            <div
              ref={(el) => (clipperRefs.current[index] = el)}
              className="container relative flex justify-center items-center w-full min-h-screen overflow-hidden bg-primary-card-light"
              style={{ clipPath: "inset(25% round 45px)" }}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || portfolio.title}
                className="w-full h-full object-contain"
                onError={(e) => (e.target.src = "/placeholder.webp")}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= NEXT PROJECT SECTION ================= */}
      {nextProject && (
        <section
          ref={nextProjectRef}
          className="relative min-h-screen overflow-hidden mt-20"
        >
          <div className="absolute inset-0">
            <img
              ref={nextBgRef}
              src={nextProject.header_image || "/placeholder.webp"}
              className="w-full h-full object-cover"
              alt={`Next: ${nextProject.title}`}
              onError={(e) => (e.target.src = "/placeholder.webp")}
            />
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen bg-black/50">
            <h2
              ref={titleFillRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            >
              Next: {nextProject.title}
            </h2>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectDetails;
