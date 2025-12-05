import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";
import { PORTFOLIO } from "../../constants/PortfolioConstants";
import BorderButton from "../../components/Buttons/BorderButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const clipperRefs = useRef([]);
  const titleFillRef = useRef(null);
  const nextProjectRef = useRef(null);
  const nextBgRef = useRef(null);

  // Fetch portfolio data based on slug
  useEffect(() => {
    if (slug) {
      const foundPortfolio = PORTFOLIO.find(p => p.slug === slug);
      const foundIndex = PORTFOLIO.findIndex(p => p.slug === slug);
      
      if (foundPortfolio) {
        setPortfolio(foundPortfolio);
        setCurrentIndex(foundIndex);
      }
      
      setLoading(false);
    }
  }, [slug]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Get next project data
  const getNextProject = () => {
    if (currentIndex !== null && PORTFOLIO.length > 0) {
      const nextIndex = (currentIndex + 1) % PORTFOLIO.length;
      return {
        project: PORTFOLIO[nextIndex],
        index: nextIndex
      };
    }
    return null;
  };

  const nextProjectData = getNextProject();

  useEffect(() => {
    if (!portfolio?.project_images) return;

    // Wait for all images to load before initializing animations
    const imagePromises = portfolio.project_images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Still resolve on error to avoid hanging
        img.src = portfolio.image_path + image;
      });
    });

    Promise.all(imagePromises).then(() => {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        // GSAP ScrollTrigger animation for clip-path
        clipperRefs.current.forEach((clip) => {
          if (clip) {
            gsap.fromTo(
              clip,
              { clipPath: "inset(25% round 50px)" }, // start state
              {
                clipPath: "inset(0% round 0px)", // end state
                ease: "none",
                scrollTrigger: {
                  trigger: clip,
                  start: "top 100%", // when image enters viewport
                  end: "bottom 100%", // until it passes
                  scrub: true,
                  markers: false, // set to true to debug
                },
              }
            );
          }
        });

        // Next project title fill animation
        if (nextProjectRef.current) {
          gsap.to(titleFillRef.current, {
            scrollTrigger: {
              trigger: nextProjectRef.current,
              start: "top 100%",
              end: "bottom 100%",
              scrub: true, // smooth with scroll
              onLeave: () => {
                // Navigate to next project when animation is done
                if (nextProjectData) {
                  // Kill all ScrollTrigger instances before navigation
                  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
                  
                  // Navigate using slug instead of state
                  navigate(`${ROUTES.PROJECT_DETAILS}/${nextProjectData.project.slug}`, {
                    replace: false
                  });
                  
                  // Scroll to top
                  if (window.lenis) {
                    window.lenis.scrollTo(0, { immediate: true });
                  } else {
                    window.scrollTo(0, 0);
                  }
                }
              }
            }
          });
        }

        // Next project background parallax animation
        if (nextBgRef.current && nextProjectRef.current) {
          gsap.to(nextBgRef.current, {
            y: "-20%",
            ease: "none",
            scrollTrigger: {
              trigger: nextProjectRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
        ScrollTrigger.refresh();
      }, 0);
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [portfolio, currentIndex, nextProjectData, navigate]);

  // Show loading while fetching portfolio data
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If no portfolio found, redirect to portfolio page
  if (!portfolio) {
    return <Navigate to={ROUTES.PORTFOLIO} replace />;
  }

  return (
    <>
      {/* Header */}
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute bg-black/50 w-full h-screen z-10 flex items-center justify-center text-shadow-lg/25 text-white font-bold text-2xl md:text-4xl lg:text-6xl xl:text-7xl">
          {portfolio.title}
        </div>  
        <img
          src={portfolio.image_path + "header.webp"}
          className="absolute top-1/2 left-0 -translate-y-1/2 min-h-full min-w-none object-cover z-0"
          alt={portfolio.title}
        />  
      </div>

      {/* Details */}
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold mb-5">PROJECT DETAILS</h1>
          <ul className="pl-2 md:pl-5">
            <li className="mb-1 text-lg">
              <strong className="mr-2 text-white">Tech Category:</strong>
              <span className="text-secondary capitalize">{portfolio.tech_category.join(", ")}</span>
            </li>
            <li className="mb-1 text-lg">
              <strong className="mr-2 text-white">Project Type:</strong>
              <span className="text-secondary capitalize">{portfolio.project_type}</span>
            </li>
            <li className="mb-1 text-lg">
              <strong className="mr-2 text-white">Publisher Name:</strong>
              <span className="text-secondary">{portfolio.publisher_name}</span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-5">INFO</h1>
          {portfolio.description.map((item, index) => (
            <p
              key={index}
              className="mb-5 pl-2 md:pl-5 text-sm lg:text-base text-justify text-secondary"
            >
              {item}
            </p>
          ))}
          <BorderButton
            title="Visit Link"
            target="_blank"
            link={portfolio.project_link}
            className="mt-5 ml-5"
          />
        </div>
      </div>

      {/* Images */}
      <div className="mt-20">
        {portfolio.project_images.map((image, index) => (
          <div key={index} className="w-full relative tt-clipper">
            <div
              ref={(el) => (clipperRefs.current[index] = el)}
              className="container relative flex justify-center items-center w-full min-h-screen overflow-hidden bg-primary-card-light tt-clipper-inner"
              style={{ clipPath: "inset(25% round 45px)" }}
            >
              <div className="absolute inset-0 -z-1 tt-clipper-bg">
                <img
                  src={portfolio.image_path + image}
                  alt={portfolio.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Project Section */}
      {nextProjectData && (
        <section 
          ref={nextProjectRef}
          className="next-project relative min-h-screen overflow-hidden"
        >
          <div className="bg absolute inset-0">
            <img 
              ref={nextBgRef}
              src={nextProjectData.project.image_path + "header.webp"} 
              alt="Next Project Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="next-project-inner relative z-10 flex items-center justify-center min-h-screen bg-black/50">
            <div className="text-center">
              <h2 ref={titleFillRef} className="text-2xl md:text-3xl lg:text-5xl font-bold">
                  Next: {nextProjectData.project.title}
              </h2>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectDetails;
