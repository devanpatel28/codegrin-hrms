import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";
import { portfolioAPI } from "../../utils/api";
import BorderButton from "../../components/Buttons/BorderButton";
import { Skeleton } from "@/components/ui/skeleton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [nextProject, setNextProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  
  const clipperRefs = useRef([]);
  const titleFillRef = useRef(null);
  const nextProjectRef = useRef(null);
  const nextBgRef = useRef(null);

  // Fetch portfolio data based on slug
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const response = await portfolioAPI.getBySlug(slug);
        setPortfolio(response.data.portfolio);
        setNextProject(response.data.nextPortfolio);
        
        // Initialize image load status
        const initialLoadStatus = {
          header: false,
          nextHeader: false
        };
        
        response.data.portfolio.images?.forEach((img, idx) => {
          initialLoadStatus[`image_${idx}`] = false;
        });
        
        setImageLoadStatus(initialLoadStatus);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle image load
  const handleImageLoad = (imageKey) => {
    setImageLoadStatus((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  useEffect(() => {
    if (!portfolio?.images || portfolio.images.length === 0) return;

    // Wait for all images to load before initializing animations
    const imagePromises = portfolio.images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = image.image_url;
      });
    });

    Promise.all(imagePromises).then(() => {
      setTimeout(() => {
        // GSAP ScrollTrigger animation for clip-path
        clipperRefs.current.forEach((clip) => {
          if (clip) {
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
                  markers: false,
                },
              }
            );
          }
        });

        // Next project title fill animation
        if (nextProjectRef.current && nextProject) {
          gsap.to(titleFillRef.current, {
            scrollTrigger: {
              trigger: nextProjectRef.current,
              start: "top 100%",
              end: "bottom 100%",
              scrub: true,
              onLeave: () => {
                // Kill all ScrollTrigger instances before navigation
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
                
                // Navigate to next project
                navigate(`${ROUTES.PROJECT_DETAILS}/${nextProject.slug}`, {
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
  }, [portfolio, nextProject, navigate]);

  // Show loading skeleton
  if (loading) {
    return (
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="relative min-h-screen w-full overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-screen" />
        </div>

        {/* Details Skeleton */}
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          <div className="lg:col-span-1">
            <Skeleton className="h-8 w-48 mb-5" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-32 mb-5" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Images Skeleton */}
        <div className="mt-20 space-y-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="container">
              <Skeleton className="w-full h-96 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If error or no portfolio found, redirect
  if (error || !portfolio) {
    return <Navigate to={ROUTES.PORTFOLIO} replace />;
  }

  return (
    <>
      {/* Header */}
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute bg-black/50 w-full h-screen z-10 flex items-center justify-center text-shadow-lg/25 text-white font-bold text-2xl md:text-4xl lg:text-6xl xl:text-7xl">
          {portfolio.title}
        </div>
        
        {/* Header Image Skeleton */}
        {!imageLoadStatus.header && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        {/* Header Image */}
        <img
          src={portfolio.header_image_url || "/placeholder.webp"}
          className={`absolute top-1/2 left-0 -translate-y-1/2 min-h-full min-w-none object-cover z-0 ${
            !imageLoadStatus.header ? "hidden" : ""
          }`}
          alt={portfolio.title}
          onLoad={() => handleImageLoad("header")}
          onError={(e) => {
            e.target.src = "/placeholder.webp";
            handleImageLoad("header");
          }}
        />
      </div>

      {/* Details */}
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold mb-5">PROJECT DETAILS</h1>
          <ul className="pl-2 md:pl-5">
            <li className="mb-1 text-lg">
              <strong className="mr-2 text-white">Tech Category:</strong>
              <span className="text-secondary capitalize">
                {portfolio.categories?.map(cat => cat.name).join(", ")}
              </span>
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
          {portfolio.descriptions?.map((description, index) => (
            <p
              key={index}
              className="mb-5 pl-2 md:pl-5 text-sm lg:text-base text-justify text-secondary"
            >
              {description}
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

      {/* Images */}
      <div className="mt-20">
        {portfolio.images?.map((image, index) => (
          <div key={image.id} className="w-full relative tt-clipper">
            <div
              ref={(el) => (clipperRefs.current[index] = el)}
              className="container relative flex justify-center items-center w-full min-h-screen overflow-hidden bg-primary-card-light tt-clipper-inner"
              style={{ clipPath: "inset(25% round 45px)" }}
            >
              <div className="absolute inset-0 -z-1 tt-clipper-bg">
                {/* Image Skeleton */}
                {!imageLoadStatus[`image_${index}`] && (
                  <Skeleton className="w-full h-full" />
                )}
                
                {/* Actual Image */}
                <img
                  src={image.image_url}
                  alt={image.alt_text || portfolio.title}
                  className={`w-full h-full object-contain ${
                    !imageLoadStatus[`image_${index}`] ? "hidden" : ""
                  }`}
                  onLoad={() => handleImageLoad(`image_${index}`)}
                  onError={(e) => {
                    e.target.src = "/placeholder.webp";
                    handleImageLoad(`image_${index}`);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Project Section */}
      {nextProject && (
        <section 
          ref={nextProjectRef}
          className="next-project relative min-h-screen overflow-hidden"
        >
          <div className="bg absolute inset-0">
            {/* Next Project Image Skeleton */}
            {!imageLoadStatus.nextHeader && (
              <Skeleton className="w-full h-full" />
            )}
            
            {/* Next Project Background Image */}
            <img 
              ref={nextBgRef}
              src={nextProject.header_image_url || "/placeholder.webp"}
              alt={`Next Project: ${nextProject.title}`}
              className={`w-full h-full object-cover ${
                !imageLoadStatus.nextHeader ? "hidden" : ""
              }`}
              onLoad={() => handleImageLoad("nextHeader")}
              onError={(e) => {
                e.target.src = "/placeholder.webp";
                handleImageLoad("nextHeader");
              }}
            />
          </div>
          <div className="next-project-inner relative z-10 flex items-center justify-center min-h-screen bg-black/50">
            <div className="text-center">
              <h2 ref={titleFillRef} className="text-2xl md:text-3xl lg:text-5xl font-bold">
                Next: {nextProject.title}
              </h2>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectDetails;
