import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";
import { portfolioAPI } from "@/utils/api";

const PortfolioCarousel = ({
  autoPlay = true,
  autoPlayInterval = 3000,
  showDashes = true,
  showArrows = true,
  className = "",
  projectLimit = 5,
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});

  // Fetch portfolio from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await portfolioAPI.getCarousel(projectLimit);
        setProjects(res.data.portfolios || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [projectLimit]);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || isHovered || projects.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, projects.length]);

  const handleRedirect = (portfolio) => {
    navigate(`${ROUTES.PROJECT_DETAILS}/${portfolio.slug}`);
  };

  const onImageLoad = (index) => {
    setLoadingImages((prev) => ({ ...prev, [index]: false }));
  };

  const onImageError = (index) => {
    setLoadingImages((prev) => ({ ...prev, [index]: "error" }));
  };

  return (
    <div
      className={`relative w-full h-[70vh] overflow-hidden rounded-3xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider */}

      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative w-full h-full flex-shrink-0 cursor-pointer"
            onClick={() => handleRedirect(project)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {loadingImages[index] !== false && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                  <Icon icon="mdi:loading" className="w-10 h-10 animate-spin text-white" />
                </div>
              )}

              <img
                src={project.header_image}
                alt={project.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  loadingImages[index] === false ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => onImageLoad(index)}
                onError={() => onImageError(index)}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Text Overlay */}
            <div className="absolute bottom-0 p-10 text-white max-w-4xl">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 hover:text-primary-light transition-colors">
                {project.title}
              </h2>

              <div className="mb-4 flex gap-2 capitalize flex-wrap">
                {project.tech_category.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-primary-light backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && projects.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
            }
            className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <Icon icon="mdi:chevron-left" className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % projects.length)}
            className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <Icon icon="mdi:chevron-right" className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDashes && projects.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-0.5 rounded-full transition-all ${
                currentSlide === idx ? "w-8 bg-primary-light" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioCarousel;
